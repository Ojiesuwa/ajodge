import express from "express";
import pingRouter from "./src/routes/ping.js";
import botRouter from "./src/routes/bot.js";
import sessionRouter from "./src/routes/session.js";
import cors from "cors";
import dotenv from "dotenv";
const result = dotenv.config();
console.log("Result: ", result);

const app = express();
app.use(cors()); // Allows all origins

console.log(process.env.FIREBASE_SERVICE_ACCOUNT);
const PORT = 8080;

app.use(express.json());

// Mount the ping route
app.use("/api/ping", pingRouter);
app.use("/api/bot", botRouter);
app.use("/api/session", sessionRouter);

app.listen(PORT, () => console.log(`I am listening on port ${PORT}`));
