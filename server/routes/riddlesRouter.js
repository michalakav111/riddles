import express from 'express';

const router = express.Router();

import { readDb, writeDb } from '../db/dbHelpers.js';


router.get("/", async (req, res) => {
    try {
        const db = await readDb();

        res.json(db.riddles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get("/:id", async (req, res) => {
    try {
        const db = await readDb();

        const id = Number(req.params.id);

        const riddle = db.riddles.find(r => r.id === id);

        if (!riddle) {
            return res.status(404).json({
                message: "Riddle not found"
            });
        }

        res.json(riddle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post("/", async (req, res) => {
    try {
        const db = await readDb();

        const newRiddle = req.body;


        const lastId = db.riddles.length > 0
            ? Math.max(...db.riddles.map(riddle => riddle.id))
            : 0;

        newRiddle.id = lastId + 1;
        db.riddles.push(newRiddle);

        await writeDb(db);

        res.status(201).json(newRiddle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const db = await readDb();

        const id = Number(req.params.id);

        const index = db.riddles.findIndex(r => r.id === id);

        if (index === -1) {
            return res.status(404).json({
                message: "Riddle not found"
            });
        }

        db.riddles[index] = {
            ...db.riddles[index],
            ...req.body,
            id
        };

        await writeDb(db);

        res.json(db.riddles[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const db = await readDb();

        const id = Number(req.params.id);

        const index = db.riddles.findIndex(r => r.id === id);

        if (index === -1) {
            return res.status(404).json({
                message: "Riddle not found"
            });
        }

        const deletedRiddle = db.riddles.splice(index, 1);

        await writeDb(db);

        res.json(deletedRiddle[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;

