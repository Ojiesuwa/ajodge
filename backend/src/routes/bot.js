import { Router } from "express";
import { logToFile } from "../utils/logger.js";
import { determineActionType } from "../utils/determineActionType.js";
import { handleGroupAdd } from "../controllers/groupadd.controller.js";
import { validateRegCode } from "../controllers/regcode.contoller.js";
import { handleBotText } from "../controllers/command.controller.js";

const botRouter = Router();

botRouter.post("/", async (req, res) => {
  console.log(`We just got data!!!: `);
  const body = await req.body;
  console.log(body);

  const action = determineActionType(body);

  console.log(action);
  if (action === "group-add") {
    handleGroupAdd(body);
  } else if (action === "reg-code") {
    validateRegCode(body);
  } else if (action === "bot-text") {
    handleBotText(body);
  }

  res.json({ message: "Received" });
});

export default botRouter;
