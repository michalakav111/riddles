import express from 'express';

const app = express();
const PORT = 3000;

import riddlesRouter from './routes/riddlesRouter.js';
import playersRouter from "./routes/playersRouter.js";
// const riddlesRouter = require("./routes/riddles");
// const playersRouter = require("./routes/players");

// מאפשר לשרת לקבל JSON בבקשות POST ו-PUT
app.use(express.json());

// חיבור Router של חידות
app.use("/api/riddles", riddlesRouter);

// חיבור Router של שחקנים
app.use("/api/players", playersRouter);

// הפעלת השרת

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});