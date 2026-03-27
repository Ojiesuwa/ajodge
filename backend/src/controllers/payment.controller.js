import { Session } from "../models/Session.js";
import { sendMessageToGroup } from "../utils/telegram.js";

export const handlePayment = async (ssid, mindex, amount) => {
  try {
    mindex = parseInt(mindex);
    amount = parseFloat(amount);
    const session = new Session(ssid);
    await session.loadFromDatabase();

    session.members[parseInt(mindex)].payment =
      (session.members[parseInt(mindex)].payment ?? 0) + amount;

    await session.updateDatabase();
    const member = session.members[parseInt(mindex)];

    const hasPayedAll = member.payment >= session.amountPerPerson;
    await sendMessageToGroup(
      session.groupChatId,
      `<b>${member.lastname} ${member.firstname}</b> just payed ${amount}.\n${hasPayedAll ? "Payment complete" : `Amount Remaining: ${parseInt(session.amountPerPerson) - member.payment}`}`,
    );
    const remainingPayment = session.members.filter(
      (data, index) => data.payment < session.amountPerPerson,
    );

    const remainingPaymentMessage = remainingPayment
      .map(
        (data, index) =>
          `${index + 1}. <b>${data.lastname} ${data.firstname}</b>: ₦${data.payment}/${session.amountPerPerson}`,
      )
      .join("\n");

    if (remainingPayment.length > 0) {
      await sendMessageToGroup(
        session.groupChatId,
        `The Remaining payee for this AJO round, includes: \n\n${remainingPaymentMessage}`,
      );
    }else{
      await sendMessageToGroup(
        session.groupChatId,
        `<b>Weldone everyone!</b>\nWe have succesfully paid off the first round for this session`,
      );
    }
    return;
  } catch (error) {
    console.error(error);
    throw new Error("Error verifying payment");
  }
};
