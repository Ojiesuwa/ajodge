import { Router } from "express";
import {
  addMemberToSession,
  createSession,
} from "../controllers/session.controller.js";
import { handlePayment } from "../controllers/payment.controller.js";
import { getCollection, getDoc } from "../firebase/utils.js";
import { handleMakePayout } from "../controllers/payout.controller.js";

const sessionRouter = Router();

sessionRouter.post("/create", async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body) {
      return res
        .status(400)
        .json({ message: "Error: No Body Object supplied" });
    }

    for (const key of Object.keys(req.body)) {
      if (!req.body[key]) {
        return res.status(400).json({
          message: `Error with ${key}. It is either empty or falsy`,
        });
      }
    }

    const { groupChatId, sessionName, timeFrame, amountPerPerson, messageId } =
      req.body;

    await createSession(
      groupChatId,
      sessionName,
      timeFrame,
      amountPerPerson,
      messageId,
    );

    return res.status(200).json({ message: "Session created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

sessionRouter.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body) {
      return res
        .status(400)
        .json({ message: "Error: No Body Object supplied" });
    }
    for (const key of Object.keys(req.body)) {
      if (!req.body[key]) {
        return res.status(400).json({
          message: `Error with ${key}. It is either empty or falsy`,
        });
      }
    }

    const {
      lastname,
      firstname,
      nin,
      accountNumber,
      bankCode,
      bankName,
      sessionId,
    } = req.body;

    const validationCode = await addMemberToSession(
      lastname,
      firstname,
      nin,
      accountNumber,
      bankCode,
      bankName,
      sessionId,
    );
    return res
      .status(200)
      .json({ message: "Session registered succesfully", validationCode });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

sessionRouter.post("/payout", async (req, res) => {
  try {
    // const collection = await getCollection("Session");
    await handleMakePayout();

    return res.status(200).json({ message: "Payout made successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

sessionRouter.post("/payment-verification", async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body) {
      return res
        .status(400)
        .json({ message: "Error: No Body Object supplied" });
    }
    for (const key of Object.keys(req.body)) {
      if (!req.body[key] && req.body[key] !== 0) {
        return res.status(400).json({
          message: `Error with ${key}. It is either empty or falsy`,
        });
      }
    }

    const { ssid, mindex, amount } = req.body;

    await handlePayment(ssid, mindex, amount);

    return res.status(200).json({ message: "Payment verified succesfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

sessionRouter.post("/members", async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body) {
      return res
        .status(400)
        .json({ message: "Error: No Body Object supplied" });
    }
    for (const key of Object.keys(req.body)) {
      if (!req.body[key] && req.body[key] !== 0) {
        return res.status(400).json({
          message: `Error with ${key}. It is either empty or falsy`,
        });
      }
    }

    const { ssid } = req.body;

    const data = await getDoc("Session", ssid);

    return res.status(200).json({
      message: "Successfully Fetched",
      members: data.members,
      amountPerPerson: parseFloat(data.amountPerPerson),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default sessionRouter;
