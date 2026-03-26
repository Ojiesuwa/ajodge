/**
 * Returns true if the bot was mentioned in a message.
 *
 * @param {object} message - The Telegram message object from the webhook body.
 * @param {string} botUsername - Your bot's username (without @).
 * @returns {boolean}
 *
 * @example
 * const mentioned = isBotMentioned(body.message, "AjodgeBot");
 */
export function isBotMentioned(message, botUsername) {
  const entities = message?.entities || message?.caption_entities || [];

  return entities.some((entity) => {
    if (entity.type !== "mention") return false;
    const mentioned = message.text?.substring(
      entity.offset,
      entity.offset + entity.length,
    );
    return mentioned?.toLowerCase() === `@${botUsername.toLowerCase()}`;
  });
}
