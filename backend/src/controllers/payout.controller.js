import { getCollection } from "../firebase/utils.js";
import { Session } from "../models/Session.js";
import { leaveGroup, sendMessageToGroup } from "../utils/telegram.js";

export const handleMakePayout = async () => {
  try {
    const collection = await getCollection("Session");
    console.log(collection);

    const sessions = collection.map((data) => new Session(data.id));
    const loadPromise = sessions.map((data) => data.loadFromDatabase());
    await Promise.all(loadPromise);

    const promise = sessions.map((data) => data.payoutForRound(data));
    const resolvedData = await Promise.all(promise);
    console.log(" resolved data: ", resolvedData);

    const dataPromise = resolvedData.map((data) =>
      data
        ? sendTelegramInformationMessage(
            data.payee,
            data.nextPayee,
            data.hasFinishedSession,
            data.session,
          )
        : new Promise((resolve, reject) => resolve()),
    );

    await Promise.all(dataPromise);

    return;
  } catch (error) {
    console.error(error);
    throw new Error("Handle Make Payout");
  }
};

const sendTelegramInformationMessage = async (
  payee,
  nextPayee,
  hasFinishedSession,
  session,
) => {
  try {
    const chatId = session.groupChatId;
    // let payoutAmount = 0;
    const payoutAmount = session.members.reduce(
      (sum, member) => sum + member.payment,
      0,
    );
    await sendMessageToGroup(
      chatId,
      `${payee.lastname} ${payee.firstname} has been successfully sent ₦${payoutAmount}`,
    );

    if (nextPayee) {
      await sendMessageToGroup(
        chatId,
        `The Next round of AJO will be payed to ${nextPayee.lastname} ${nextPayee.firstname}`,
      );
    }

    if (!hasFinishedSession) {
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
      await sendMessageToGroup(
        chatId,
        `Click on this link to pay:\nhttps://www.google.com`,
      );
    } else {
      await sendMessageToGroup(
        chatId,
        "✅ <b>Session Complete!</b>\n\nThis AJO session has ended. Goodbye! 👋",
      );
      await leaveGroup(chatId);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error sending telegram information message");
  }
};
