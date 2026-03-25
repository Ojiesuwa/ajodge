import { Session } from "../models/Session.js";
import { sendMessageToGroup } from "../utils/telegram.js";

export const validateRegCode = async (body) => {
  try {
    const regCode = body.message.text;
    const sessionId = regCode.split(":")[1];
    const memberId = regCode.split(":")[0];
    const message = await sendMessageToGroup(
      body.message.chat.id,
      "Validating registration code...",
    );
    const session = new Session(sessionId);
    await session.loadFromDatabase();

    const result = session.validateMember(memberId, body.message.from.id);
    if (!result) {
      await sendMessageToGroup(
        body.message.chat.id,
        `❌ <b>Invalid Code</b>\n\nHmm, that code doesn't seem right. 🤔\nPlease double-check and try again.`,
        body.message.message_id,
      );
    } else {
      await session.updateDatabase();
      await sendMessageToGroup(
        body.message.chat.id,
        `🎉 <b>Welcome aboard, ${result.message}!</b>\n\n✅ Your registration is complete and you're officially part of this AJO session.\n\n💪 Let's save together!`,
        body.message.message_id,
      );
      await sendMessageToGroup(body.message.chat.id, result.registeredMessage);
      await sendMessageToGroup(
        body.message.chat.id,
        "To proceed with the ajo. You can tag me and request to proceed",
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error validating reg code");
  }
};
