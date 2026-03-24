// firebase.js
import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

// ─── Resolve __dirname in ESM ────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Load service account key via readFileSync (ESM-safe) ────────────────────
const serviceAccount = JSON.parse(
  readFileSync(
    path.join(
      __dirname,
      "ajodge-c9fcb-firebase-adminsdk-fbsvc-8544d1fa58.json",
    ),
    "utf8",
  ),
);

// ─── Initialize only once ────────────────────────────────────────────────────
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// ─── Export Firestore DB instance ────────────────────────────────────────────
const db = admin.firestore();

export { db, admin };
