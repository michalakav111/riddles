

export async function getAllRiddles() {
    const response = await fetch("http://localhost:3000/api/riddles");

    const riddles = await response.json();

    return riddles;
}

export async function createRiddle(riddle) {
    const response = await fetch("http://localhost:3000/api/riddles", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(riddle)
    });

    const newRiddle = await response.json();

    return newRiddle;
}
export async function updateRiddle(id, riddle) {
    const response = await fetch(`http://localhost:3000/api/riddles/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(riddle)
    });

    const updatedRiddle = await response.json();

    return updatedRiddle;
}
export async function deleteRiddle(id) {
    const response = await fetch(`http://localhost:3000/api/riddles/${id}`, {
        method: "DELETE"
    });

    return response.ok;
}