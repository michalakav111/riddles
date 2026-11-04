// In api/playersApi.js write and export:
// getAllPlayers()

 export async function getAllPlayers() {
    try {
        const response = await fetch("http://localhost:3000/players");
        return await response.json();
    } catch (error) {
        console.error("Error fetching all players:", error);
        throw error;
    }
}

// export async function findPlayerByName(name) {
//     try {
//         const response = await fetch(`http://localhost:3000/players?name=${encodeURIComponent(name)}`);
//         const players = await response.json();
//         return players.length > 0 ? players[0] : undefined;
//     } catch (error) {
//         console.error("Error finding player by name:", error);
//         throw error;
//     }
// }
// export async function findPlayerByName(name) {
//     try {
//         const response = await fetch(
//             `http://localhost:3000/players?name=${encodeURIComponent(name.trim())}`
//         );

//         // בדיקה שהשרת החזיר תשובה תקינה
//         if (!response.ok) {
//             throw new Error(`Server error: ${response.status}`);
//         }

//         const players = await response.json();

//         // אם נמצא שחקן – מחזירים אותו, אחרת מחזירים undefined
//         return players.length > 0 ? players[0] : undefined;

//     } catch (error) {
//         console.error("Error finding player:", error.message);
//         return undefined;
//     }
// }

export async function findPlayerByName(name) {
    try {
        const cleanName = name.trim();

        const url = `http://localhost:3000/players?name=${encodeURIComponent(cleanName)}`;

        console.log("Searching URL:", url);

        const response = await fetch(url);

        console.log("Response status:", response.status);

        const players = await response.json();

        console.log("Players returned from server:", players);

        const player = players.find(
            p => p.name.trim().toLowerCase() === cleanName.toLowerCase()
        );

        console.log("Found player:", player);

        return player;

    } catch (error) {
        console.error("Error finding player:", error);
        throw error;
    }
}


// createPlayer(name) - adds a new player with lowestTime: null
export async function createPlayer(name) {
    try {
        const response = await fetch("http://localhost:3000/players", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, lowestTime: null })
        });
        return await response.json();
    } catch (error) {
        console.error("Error creating player:", error);
        throw error;
    }
}

// updatePlayer(player) - saves the player's new lowestTime
// מקבלת שחקן 
 export async function updatePlayer(player) {
    try {
        const response = await fetch(`http://localhost:3000/players/${player.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(player)
        });
        return await response.json();
    } catch (error) {
        console.error("Error updating player:", error);
        throw error;
    }
}

// export async function updatePlayerTime(id, lowestTime) {
//     const response = await fetch(`http://localhost:3000/players/${id}`, {
//         method: "PATCH",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ lowestTime })
//     });

//     return await response.json();
// }

