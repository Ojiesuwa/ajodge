/**
 * telegramUtils.js
 * Reusable Telegram Bot API utility functions for AjoBot.
 * Uses the Telegram Bot API directly via fetch — no third-party library required.
 *
 * Set your bot token in your environment:
 *   TELEGRAM_BOT_TOKEN=your_token_here
 */

const TELEGRAM_API_BASE = `https://api.telegram.org/bot7873110873:AAE3ZsUtHixFtltuspDFw1_Yob7SkD7hpA0`;

/**
 * Internal helper — makes a POST request to any Telegram Bot API method.
 *
 * @param {string} method - Telegram API method name (e.g. "sendMessage").
 * @param {object} body - The request payload.
 * @returns {Promise<object>} The `result` field from the Telegram API response.
 */
async function callTelegramAPI(method, body) {
  const url = `${TELEGRAM_API_BASE}/${method}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!data.ok) {
    // throw new Error(
    //   `[Telegram API] ${method} failed — ${data.description} (error_code: ${data.error_code})`,
    // );
    console.error(
      `[Telegram API] ${method} failed — ${data.description} (error_code: ${data.error_code})`,
    );
  }

  return data.result;
}

// ─────────────────────────────────────────────
// MESSAGING
// ─────────────────────────────────────────────

/**
 * Sends a plain text message to a group (or any chat).
 * Optionally replies to an existing message by passing a replyToMessageId.
 *
 * @param {string|number} chatId - The target group/chat ID.
 * @param {string} text - The message text. Supports HTML tags when parse_mode is "HTML".
 * @param {number|null} [replyToMessageId=null] - The message_id to reply to. Pass null to send normally.
 * @param {object} [options={}] - Extra Telegram sendMessage fields (e.g. disable_notification).
 * @returns {Promise<object>} The sent Message object.
 *
 * @example
 * // Regular message
 * await sendMessageToGroup("-1001234567890", "💰 Reminder: contributions are due today!");
 *
 * // Reply to a specific message
 * await sendMessageToGroup("-1001234567890", "✅ Got it!", 987654321);
 */
export async function sendMessageToGroup(
  chatId,
  text,
  replyToMessageId = null,
  options = {},
) {
  return callTelegramAPI("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    ...(replyToMessageId && {
      reply_parameters: { message_id: replyToMessageId },
    }),
    ...options,
  });
}
/**
 * Sends a native Telegram poll to a group.
 *
 * @param {string|number} chatId - The target group/chat ID.
 * @param {string} question - The poll question (1–300 characters).
 * @param {string[]} pollOptions - Array of answer strings (2–10 items, each 1–100 chars).
 * @param {object} [options={}] - Extra Telegram sendPoll fields.
 *   @param {boolean} [options.is_anonymous=false] - Whether votes are anonymous.
 *   @param {boolean} [options.allows_multiple_answers=false] - Allow multiple selections.
 *   @param {string}  [options.type="regular"] - "regular" or "quiz".
 *   @param {number}  [options.open_period] - Seconds the poll stays open (5–600).
 * @returns {Promise<object>} The sent Message object containing the Poll.
 *
 * @example
 * await sendPollToGroup("-1001234567890", "Should we extend the deadline for Chioma?", [
 *   "✅ Yes, extend by 1 week",
 *   "❌ No, mark as default",
 * ]);
 */
export async function sendPollToGroup(
  chatId,
  question,
  pollOptions,
  options = {},
) {
  if (!pollOptions || pollOptions.length < 2) {
    throw new Error("[sendPollToGroup] A poll requires at least 2 options.");
  }
  if (pollOptions.length > 10) {
    throw new Error(
      "[sendPollToGroup] A poll cannot have more than 10 options.",
    );
  }

  return callTelegramAPI("sendPoll", {
    chat_id: chatId,
    question,
    options: pollOptions,
    is_anonymous: false,
    allows_multiple_answers: false,
    type: "regular",
    ...options,
  });
}

/**
 * Deletes a specific message from a chat.
 * Note: Bots can only delete messages that are less than 48 hours old,
 * or messages sent by the bot itself.
 *
 * @param {string|number} chatId - The chat ID where the message lives.
 * @param {number} messageId - The ID of the message to delete.
 * @returns {Promise<boolean>} True on success.
 *
 * @example
 * await deleteMessage("-1001234567890", 421);
 */
export async function deleteMessage(chatId, messageId) {
  return callTelegramAPI("deleteMessage", {
    chat_id: chatId,
    message_id: messageId,
  });
}

/**
 * Sends a text message with an inline keyboard containing one or more buttons.
 * Supports URL buttons and callback buttons in any row/column layout.
 *
 * @param {string|number} chatId - The target group/chat ID.
 * @param {string} text - The message text shown above the buttons.
 * @param {Array<Array<{text: string, url?: string, callback_data?: string}>>} buttonRows
 *   A 2D array of button objects. Each inner array is one row.
 *   Each button needs a `text` label and either `url` or `callback_data`.
 * @param {object} [options={}] - Extra Telegram sendMessage fields.
 * @returns {Promise<object>} The sent Message object.
 *
 * @example
 * await sendButtonWithMessage("-1001234567890", "Round 3 payment is due:", [
 *   [{ text: "💳 Pay via Interswitch", url: "https://pay.interswitch.com/xxx" }],
 *   [{ text: "✅ I've paid", callback_data: "paid_r3" }, { text: "⏳ Need more time", callback_data: "defer_r3" }],
 * ]);
 */
export async function sendButtonWithMessage(
  chatId,
  text,
  buttonRows,
  options = {},
) {
  if (!buttonRows || buttonRows.length === 0) {
    throw new Error(
      "[sendButtonWithMessage] buttonRows must be a non-empty 2D array.",
    );
  }

  return callTelegramAPI("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: buttonRows,
    },
    ...options,
  });
}

/**
 * Sends a message with a single inline button — URL or callback.
 * Convenience wrapper around sendButtonWithMessage for the common one-button case.
 *
 * @param {string|number} chatId - The target group/chat ID.
 * @param {string} text - The message text shown above the button.
 * @param {string} buttonText - The label displayed on the button.
 * @param {{ url?: string, callback_data?: string }} buttonAction
 *   Pass `{ url: "https://..." }` for a link button,
 *   or `{ callback_data: "some_action" }` for a callback button.
 * @param {object} [options={}] - Extra Telegram sendMessage fields.
 * @returns {Promise<object>} The sent Message object.
 *
 * @example
 * // URL button
 * await sendButton("-1001234567890", "Your payment link is ready 👇", "💳 Pay Now", {
 *   url: "https://pay.interswitch.com/abc123",
 * });
 *
 * // Callback button
 * await sendButton("-1001234567890", "Confirm your contribution for Round 2:", "✅ Confirm", {
 *   callback_data: "confirm_round_2",
 * });
 */
export async function sendButton(
  chatId,
  text,
  buttonText,
  buttonAction,
  options = {},
) {
  if (!buttonAction.url && !buttonAction.callback_data) {
    throw new Error(
      "[sendButton] buttonAction must include either a `url` or `callback_data` field.",
    );
  }

  return sendButtonWithMessage(
    chatId,
    text,
    [[{ text: buttonText, ...buttonAction }]],
    options,
  );
}

/**
 * Sends a message with a Telegram Web App (TWA) button.
 * When tapped, the button opens the provided URL as an inline WebApp inside Telegram
 * (not in an external browser). The WebApp can access Telegram.WebApp JS context.
 *
 * Note: web_app buttons are only supported in private chats and groups.
 * They do NOT work in inline mode or channels.
 *
 * @param {string|number} chatId - The target group/chat ID.
 * @param {string} text - The message text shown above the button.
 * @param {string} buttonTitle - The label displayed on the TWA button.
 * @param {string} twaUrl - The HTTPS URL of the Telegram Web App to open.
 *   Must be HTTPS. Can include query params to pass context (e.g. ?groupId=xxx&round=2).
 * @param {object} [options={}] - Extra Telegram sendMessage fields.
 * @returns {Promise<object>} The sent Message object.
 *
 * @example
 * await sendTWAButton(
 *   "-1001234567890",
 *   "Complete your identity verification to join this Ajo group 👇",
 *   "🪪 Verify with NIN",
 *   "https://ajobot.app/verify?groupId=GRP-001"
 * );
 */
export async function sendTWAButton(
  chatId,
  text,
  buttonTitle,
  twaUrl,
  options = {},
) {
  if (!twaUrl || !twaUrl.startsWith("https://")) {
    throw new Error("[sendTWAButton] twaUrl must be a valid HTTPS URL.");
  }

  return callTelegramAPI("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: buttonTitle,
            web_app: { url: twaUrl },
          },
        ],
      ],
    },
    ...options,
  });
}

export async function getGroupMemberCount(chatId) {
  return callTelegramAPI("getChatMemberCount", {
    chat_id: chatId,
  });
}

/**
 * Edits the inline keyboard buttons of an existing message.
 * Useful for updating button URLs or callback data after the message_id is known —
 * e.g. embedding the message_id into a self-deleting redirect URL.
 *
 * @param {string|number} chatId - The chat ID where the message lives.
 * @param {number} messageId - The ID of the message to edit.
 * @param {Array<Array<{text: string, url?: string, callback_data?: string, web_app?: {url: string}}>>} buttonRows
 *   A 2D array of button objects to replace the existing inline keyboard.
 * @returns {Promise<object>} The edited Message object.
 *
 * @example
 * const message = await sendButton(chatId, "Payment ready 👇", "💳 Pay Now", { url: "https://placeholder.com" });
 *
 * await editButton(chatId, message.message_id, [[{
 *   text: "💳 Pay Now",
 *   url: `https://ajobot.app/pay?chatId=${chatId}&msgId=${message.message_id}&redirect=${encodeURIComponent(paymentUrl)}`
 * }]]);
 */
export async function editButton(chatId, messageId, buttonRows) {
  if (!buttonRows || buttonRows.length === 0) {
    throw new Error("[editButton] buttonRows must be a non-empty 2D array.");
  }

  return callTelegramAPI("editMessageReplyMarkup", {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: {
      inline_keyboard: buttonRows,
    },
  });
}

export async function leaveGroup(chatId) {
  return callTelegramAPI("leaveChat", {
    chat_id: chatId,
  });
}
