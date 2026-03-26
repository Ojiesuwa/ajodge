import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const LOGS_DIR = path.join(__dirname, "logs");

// Ensure logs folder exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

/**
 * @param {string} label - A name for the log file (e.g. "webhook-payload")
 * @param {any} data - The data to log
 */
function logToFile(label, data) {
  const timestamp = new Date().toISOString();
  const filename = `${label}-${timestamp.replace(/[:.]/g, "-")}.json`;
  const filepath = path.join(LOGS_DIR, filename);

  const payload = JSON.stringify({ timestamp, label, data }, null, 2);

  fs.writeFileSync(filepath, payload, "utf-8");
  console.log(`[logger] Saved → logs/${filename}`);
}

export { logToFile };
