import {
  editButton,
  sendButton,
  sendButtonWithMessage,
  sendMessageToGroup,
  sendTWAButton,
} from "../utils/telegram.js";

export const handleGroupAdd = async (body) => {
  try {
    // Send an ajo setup form to the group once added

    console.log(body);

    await sendMessageToGroup(body.message.chat.id, "Hi! I am Ajodge");
    await sendMessageToGroup(
      body.message.chat.id,
      "I will be your AI agent in charge of handling your ajo session",
    );

    const message = await sendButton(
      body.message.chat.id,
      "Please click on this button to setup your AJO and initiate process",
      "Loading...",
      {
        url: `https://ajo-setup.vercel.app/?gcid=${"loading"}&msid=${"loading"}`,
      },
    );

    await editButton(body.message.chat.id, message.message_id, [
      [
        {
          text: "SETUP AJO 🏦",
          url: `https://ajodge.vercel.app/?gcid=${body.message.chat.id}&msid=${message.message_id}`,
        },
      ],
    ]);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
