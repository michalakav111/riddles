import {Riddle} from "./Riddle.js";
import PromptSync from "prompt-sync";
const prompt = PromptSync();
class MultipleChoiceRiddle extends Riddle {
    constructor(details) {
        super(
            details.id,
            details.name,
            details.taskDescription,
            details.correctAnswer,
            details.choices,
            details.level,
            details.timeLimit,
            details.hint
        );
        this.choices = details.choices;
    }
    // ask() {
    //     let answer;
    //     do {
    //         console.log(this.name);
    //         console.log(this.taskDescription);
    //         console.log("choose the correct answer:");
    //         this.choices.forEach((choice, index) => console.log(index + 1, ") ", choice));
    //         answer = prompt("Your answer:");
    //     } while (this.choices[Number(answer) - 1] !== this.correctAnswer)
    //     return true;
    // }

    ask(prompt) {
        let answer;
        let hint;
        let penalty = 0;
        do {
            let timeS = Date.now();
            console.log(this.name);
            console.log(this.taskDescription);
            console.log("choose the correct answer:");
            console.log("Type 'hint' to receive a clue (adds 10 seconds penalty");
            this.choices.forEach((choice, index) => console.log(index + 1, ") ", choice));
            answer = prompt("Your answer:");

            if (answer !== "hint") {
                let timeE = Date.now();
                if ((timeE - timeS) / 1000 > this.timeLimit) {
                    console.log("Too slow! 5 seconds penalty applied");
                    penalty += 5;
                }
            } else {
                penalty += 10;
                console.log("the hint:", this.hint);
                console.log(this.taskDescription);
                console.log("choose the correct answer:");
                this.choices.forEach((choice, index) => console.log(index + 1, ") ", choice));
                answer = prompt("Your answer:");
            }

        } while (this.choices[Number(answer) - 1] !== this.correctAnswer)
        return penalty;
    }

}
export default MultipleChoiceRiddle;