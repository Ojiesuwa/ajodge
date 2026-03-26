import { isBotMentioned } from "./botMention.js";

const sampleData = {
  update_id: 713171600,
  message: {
    message_id: 11,
    from: {
      id: 7970717320,
      is_bot: false,
      first_name: "Temidire",
      last_name: "Oluwarotimi",
      language_code: "en",
    },
    chat: {
      id: -5176137840,
      title: "Temidire and Dad",
      type: "group",
      all_members_are_administrators: false,
      accepted_gift_types: {
        unlimited_gifts: false,
        limited_gifts: false,
        unique_gifts: false,
        premium_subscription: false,
        gifts_from_channels: false,
      },
    },
    date: 1774008845,
    new_chat_participant: {
      id: 7873110873,
      is_bot: true,
      first_name: "ajodge",
      username: "ajodge_bot",
    },
    new_chat_member: {
      id: 7873110873,
      is_bot: true,
      first_name: "ajodge",
      username: "ajodge_bot",
    },
    new_chat_members: [
      {
        id: 7873110873,
        is_bot: true,
        first_name: "ajodge",
        username: "ajodge_bot",
      },
    ],
  },
};

export const determineActionType = (body) => {
  try {
    const message = body.message;
    if (message.chat.type !== "group") return null;
    else if (message.new_chat_participant) return "group-add";
    else if (message.left_chat_participant) return "group-exit";
    else if (message.text) {
      if (/^[A-Z0-9]{9}:[A-Za-z0-9]+$/.test(message.text)) {
        return "reg-code";
      }
      if (isBotMentioned(body.message, "ajodge_bot")) {
        return "bot-text";
      }
      return "group-text";
    } else return null;
  } catch (error) {
    return null;
  }
};
