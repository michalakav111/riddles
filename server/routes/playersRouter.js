import express from 'express';

const router = express.Router();

import { readDb, writeDb } from '../db/dbHelpers.js';


router.get("/", async (req, res) => {
    try {
        const db = await readDb();

        const name = req.query.name;

        if (name) {
            const players = db.players.filter(
                p => p.name.toLowerCase() === name.toLowerCase()
            );

            return res.json(players);
        }

        res.json(db.players);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// !!!11--------------------------------לבדוק---------------------------

router.post("/", async (req, res) => {
    try {
        const db = await readDb();

        const newPlayer = req.body;

       
        const lastId = db.players.length > 0
            ? Math.max(...db.players.map(player => player.id))
            : 0;

        newPlayer.id = lastId + 1;

        db.players.push(newPlayer);

        await writeDb(db);

        res.status(201).json(newPlayer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const db = await readDb();

        const id = Number(req.params.id);

        const index = db.players.findIndex(p => p.id === id);

        if (index === -1) {
            return res.status(404).json({
                message: "Player not found"
            });
        }

        db.players[index] = {
            ...db.players[index],
            ...req.body,
            id
        };
    console.log("PUT ROUTER REACHED!");

        await writeDb(db);

        res.json(db.players[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



export default router;