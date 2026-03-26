export function generateCode(length = 9) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

// Usage
// const code = generateCode(); // e.g. "K7X2MNQ4R"
