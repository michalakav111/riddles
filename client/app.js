
import PromptSync from 'prompt-sync';
// import {Riddle} from './classes/MultipleChoiceRiddle.js';

import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { Player } from './classes/Player.js';

import { Riddle } from './classes/Riddle.js';
import * as riddelAPi from './api/riddlesApi.js';
import * as playersApi from './api/playersApi.js';
const rl = readline.createInterface({ input, output });

async function mainMenu() {
    let choice;

    do {
        console.log(`
What do you want to do?
1. Play the game
2. Create a new riddle
3. Read all riddles
4. Update an existing riddle
5. Delete a riddle
6. View leaderboard
0. Exit
        `);
 choice = await rl.question("Choose an option: ");
    switch (choice) {
            case "1":
                console.log("Play the game");
                playGame();
                break;

            case "2":
                console.log("Create a new riddle");
                await createRiddleMenu(rl);
                break;

            case "3":
                console.log("Read all riddles");
                await readAllRiddlesMenu();
                break;

            case "4":
                console.log("Update an existing riddle");
                await updateRiddleMenu(rl);
                break;

            case "5":
                console.log("Delete a riddle");
                await deleteRiddleMenu(rl);
                break;

            case "6":
                console.log("View leaderboard");
                await viewLeaderboard();
                break;

            case "0":
                console.log("Goodbye!");
                break;

            default:
                console.log("Invalid choice, try again.");
        }
    } while (choice !== "0");

    rl.close();
}     

mainMenu() ;


// פונקציות


async function createRiddleMenu(rl) {
    const name = await rl.question("Enter riddle name: ");

    const taskDescription = await rl.question("Enter description: ");

    const correctAnswer = await rl.question("Enter correct answer: ");

    const choicesInput = await rl.question("Enter choices (comma-separated): ");
    const choices = choicesInput.split(',');

    const level = await rl.question("Enter level: ");

    const newRiddle = {
        name,
        taskDescription,
        correctAnswer,
        choices,
        level
    }
    console.log("Creating riddle:", newRiddle);
  try {
        const answer = await riddelAPi.createRiddle(newRiddle);

        console.log(`Riddle created successfully: ${answer.name} (ID: ${answer.id})`);

    } catch (error) {
        console.log("Failed to create riddle:", error.message);
    }

}

// Read	Show all riddles in the DB
async function readAllRiddlesMenu() {
    const riddles = await riddelAPi.getAllRiddles();
    riddles.forEach(riddle => {
        console.log(`- ${riddle.name}: ${riddle.taskDescription}`);
    });
}

// Update	Ask for an ID and change the details of that riddle

async function updateRiddleMenu(rl) {
    const id = Number(await rl.question("Enter riddle ID to update: "));

    const riddles = await riddelAPi.getAllRiddles();

    if (!riddles.some(riddle => riddle.id === id)) {
        console.log("Riddle not found!");
        return;
    }

    const name = await rl.question("Enter new riddle name: ");
    const taskDescription = await rl.question("Enter new description: ");
    const correctAnswer = await rl.question("Enter new correct answer: ");

    const choicesInput = await rl.question("Enter new choices (comma-separated): ");
    const choices = choicesInput.split(',').map(choice => choice.trim());

    const level = await rl.question("Enter new level: ");

    const riddle = new Riddle(
        id,
        name,
        taskDescription,
        correctAnswer,
        choices,
        level
        
    );

    await riddelAPi.updateRiddle(id, riddle);

    console.log("Riddle updated!");
}


// Delete	Ask for an ID and remove that riddle
async function deleteRiddleMenu(rl) {
    const id = await rl.question("Enter riddle ID to delete: ");
    await riddelAPi.deleteRiddle(id);
    console.log("Riddle deleted!");
}

// When a player starts a game:
// Check if they already exist in the players DB.
// If they do and they have a time, show:
// If not, add them to the DB with no lowestTime yet (null).
async function checkPlayerStatus(name) {
    try {
        let player = await playersApi.findPlayerByName(name);

        if (player) {
            if (player.lowestTime !== null) {
                console.log(`Welcome back, ${name}! Your best time is ${player.lowestTime} seconds.`);
            } else {
                console.log(`Welcome back, ${name}! You haven't completed a game yet.`);
            }
        } else {
            console.log(`Hi, ${name}! You haven't completed a game yet.`);
            player = await playersApi.createPlayer(name);
        }

        return player;

    } catch (error) {
        console.error("Error checking player status:", error.message);
        throw error;
    }
}



async function playGame() {
    const prompt = PromptSync();

    console.log("Hello! welcome to our riddle game");

    const name = prompt("What is your name? ").trim();

   
    const existingPlayer = await checkPlayerStatus(name);
    console.log("existingPlayer-check:", existingPlayer);
    // יצירת שחקן חדש עם אותו השם בשביל לשמור את תוצאות המשחק ולהשוות
    const P1 = new Player(name);

    const level = prompt(
        "Choose difficulty: easy / medium / hard: "
    ).trim().toLowerCase();

    if (!["easy", "medium", "hard"].includes(level)) {
        console.log("Invalid difficulty!");
        return;
    }

    const allRiddles = await riddelAPi.getAllRiddles();

    const riddlesPerLevel = allRiddles.filter(
        x => x.level?.toLowerCase() === level
    );

    if (riddlesPerLevel.length === 0) {
        console.log("No riddles found for this level!");
        return;
    }

    riddlesPerLevel.sort(() => Math.random() - 0.5);

    for (const x of riddlesPerLevel) {
        const startT = Date.now();

        const R1 = new Riddle(
            x.id,
            x.name,
            x.taskDescription,
            x.correctAnswer,
            x.choices,
            x.level,
            x.timeLimit,
            x.hint
        );

        const penalties = R1.ask(prompt);

        const endT = Date.now();

        P1.recordTime(startT, endT + penalties * 1000);
        
    }

    P1.showStats();
   await updatePlayerTime(existingPlayer, P1.totalTime);
    console.log("name",existingPlayer.name);

    console.log("existingPlayer:", existingPlayer);

    console.log("Thanks for playing!");

    }
// עדכון הזמן

async function updatePlayerTime(player, lowestTime) {
    // let playerf = await playersApi.findPlayerByName(player.name);
// אם הוא קיים כבר ורק צריך לעכן זמן 
    if (player) {
        if (player.lowestTime == null ||
            lowestTime < player.lowestTime ) {
            console.log("New record time saved!");

            player.lowestTime = lowestTime;
            console.log("player from UPDATE .:", player);

            
            // const player = new Player(existingPlayer.name);
            // player.id = existingPlayer.id;
            // player.lowestTime = P1.totalTime;
            await playersApi.updatePlayer(player);
        }
        else{

            console.log("You did not beat your previous record time of ", player.lowestTime, "seconds.  ");
        }

        }
        else{
            console.log('hear');
        }
    }

    
// Load all players from the DB.
// Skip players who never finished a game (lowestTime is null).
// Sort by lowestTime ascending (fastest first).
// Show the results:

async function viewLeaderboard() {
    const players = await playersApi.getAllPlayers();
    const finishedPlayers = players.filter(player => player.lowestTime !== null);
    finishedPlayers.sort((a, b) => a.lowestTime - b.lowestTime);
    finishedPlayers.forEach((player, index) => {
        console.log(`${index + 1}. ${player.name}: ${player.lowestTime}`);
    });
}