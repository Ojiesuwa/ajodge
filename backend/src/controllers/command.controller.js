import { getCollection } from "../firebase/utils.js";
import { states } from "../hard-code/states.js";
import { Session } from "../models/Session.js";
import {
  leaveGroup,
  sendButton,
  sendMessageToGroup,
} from "../utils/telegram.js";
import { handleGroupAdd } from "./groupadd.controller.js";

export const handleBotText = (body) => {
  try {
    const message = body.message.text;
    const command = message.split("@ajodge_bot")[1].trim();

    console.log(command);
    if (command === "proceed") {
      handleProceedCommand(body);
    } else if (command === "cancel") {
      handleCancelCommand(body);
    } else if (command === "restart") {
      handleRestartCommand(body);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error processing bot text");
  }
};

const handleRestartCommand = async (body) => {
  try {
    const chatId = body.message.chat.id;
    const dbQuick = await getCollection("Session", [
      ["groupChatId", "==", String(chatId)],
    ]);

    console.log(dbQuick);

    if (dbQuick.length === 0) {
      await sendMessageToGroup(chatId, "There was never an ongoing session!");
      await handleGroupAdd(body);
      return;
    }

    const session = new Session(dbQuick[0].id);
    await session.loadFromDatabase();

    session.state = states[2];
    session.status = false;

    await session.updateDatabase();

    return;
  } catch (error) {
    console.error(error);
    throw new Error("Error Handling Proceed Command");
  }
};

const handleCancelCommand = async (body) => {
  try {
    const chatId = body.message.chat.id;
    console.log(chatId);
    const dbQuick = await getCollection("Session", [
      ["groupChatId", "==", String(chatId)],
    ]);

    console.log(dbQuick);
    if (dbQuick.length === 0) {
      await sendMessageToGroup(chatId, "There was never an ongoing session!");
      leaveGroup(chatId);
      return;
    }

    const session = new Session(dbQuick[0].id);
    await session.loadFromDatabase();

    session.state = states[2];
    session.status = false;

    await session.updateDatabase();

    leaveGroup(chatId);

    return;
  } catch (error) {
    console.error(error);
    throw new Error("Error Handling Proceed Command");
  }
};

const handleProceedCommand = async (body) => {
  try {
    const chatId = body.message.chat.id;
    const dbQuick = await getCollection("Session", [
      ["groupChatId", "==", String(chatId)],
    ]);

    console.log(dbQuick);

    const session = new Session(dbQuick[0].id);
    await session.loadFromDatabase();

    if (session.state === states[1]) {
      await sendMessageToGroup(
        chatId,
        `${session.sessionName} is already in progress`,
      );
      return;
    }

    session.state = states[1];
    session.members = session.members.map((data) => ({ ...data, payment: 0 }));
    await session.updateDatabase();
    const userPayment = session.members
      .map(
        (data) =>
          `<a href="tg://user?id=${data.tId}"><b>${data.lastname} ${data.firstname}</b></a>: ₦${data.payment}/₦${session.amountPerPerson}`,
      )
      .join("\n");
    await sendMessageToGroup(
      chatId,
      `Your AJO Session (${session.sessionName}) is now in progress`,
    );
    await sendMessageToGroup(
      chatId,
      `This is how much each user has payed so far out of <b>₦${session.amountPerPerson}</b>\n\n${userPayment}`,
    );
    await sendButton(chatId, "Click on this button to pay", "Pay for Ajo", {
      url: `https://ajodge.vercel.app/ajo-payment?ssid=${session.id}`,
    });

    return;
  } catch (error) {
    console.error(error);
    throw new Error("Error Handling Proceed Command");
  }
};
