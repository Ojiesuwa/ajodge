import { db } from "../firebase/config.js";
import { addDoc } from "../firebase/utils.js";
import { Session } from "../models/Session.js";
import {
  deleteMessage,
  sendButton,
  sendMessageToGroup,
} from "../utils/telegram.js";

export const createSession = async (
  groupChatId,
  sessionName,
  timeFrame,
  amountPerPerson,
  messageId,
) => {
  try {
    const session = new Session(
      groupChatId,
      sessionName,
      timeFrame,
      amountPerPerson,
    );
    await session.createDatabase();

    await deleteMessage(groupChatId, messageId);

    const messages = [
      `🎉 <b>Congratulations!</b> Your AJO session <b>${sessionName}</b> has been successfully created.`,
      `📋 For transparency reasons, here are the details of this AJO session:`,
      `📌 <b>AJO Name</b>\n${sessionName}\n\n💰 <b>Contribution per Person</b>\n${amountPerPerson}\n\n⏳ <b>Payment Duration</b>\n${timeFrame}`,
      `🚀 Member registration is now open!`,
      ,
    ];
    for (const message of messages) {
      await sendMessageToGroup(groupChatId, message);
    }

    const message = sendButton(
      groupChatId,
      `👇 Please, everyone should click on the button below to register`,
      "Register",
      { url: `https://ajodge.vercel.app/ajo-registration?ssid=${session.id}` },
    );

    session.registerLinkId = message.message_id;
    await session.updateDatabase();
    return;
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};

export const addMemberToSession = async (
  lastname,
  firstname,
  nin,
  accountNumber,
  bankCode,
  bankName,
  sessionId,
) => {
  try {
    console.log(sessionId);
    const session = new Session(sessionId);
    await session.loadFromDatabase();
    const validationCode = session.addNewMember(
      lastname,
      firstname,
      nin,
      accountNumber,
      bankCode,
      bankName,
    );
    await session.updateDatabase();
    sendMessageToGroup(
      session.groupChatId,
      `${firstname}, Congratulation on your registration, please paste the code you were given here `,
    );
    return validationCode;
  } catch (error) {
    console.error(error);
    throw new Error("Error adding user to session");
  }
};
