import express from "express";
import pingRouter from "./src/routes/ping.js";
import botRouter from "./src/routes/bot.js";
import sessionRouter from "./src/routes/session.js";
import cors from "cors";

const app = express();
app.use(cors()); // Allows all origins

const PORT = 8080;

app.use(express.json());

// Mount the ping route
app.use("/api/ping", pingRouter);
app.use("/api/bot", botRouter);
app.use("/api/session", sessionRouter);

app.listen(PORT, () => console.log(`I am listening on port ${PORT}`));
