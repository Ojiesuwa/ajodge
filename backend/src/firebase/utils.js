// firestore.js
// Core Firestore utility functions for Express.js
// All functions are async and throw on failure — wrap in try/catch at the route level.

import { db } from "./config.js";

// ─────────────────────────────────────────────────────────────────────────────
// CREATE DOC — creates a new document with a CUSTOM ID you provide
// Returns: { id: string }
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {string} collection - Firestore collection name
 * @param {string} id         - The custom document ID you want to assign
 * @param {object} data       - Document fields to store
 * @returns {{ id: string }}
 */
export async function createDoc(collection, id, data) {
  await db.collection(collection).doc(id).set(data);
  return { id };
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD DOC — adds a new document with an AUTO-GENERATED ID
// Returns: { id: string }
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {string} collection - Firestore collection name
 * @param {object} data       - Document fields to store
 * @returns {{ id: string }}
 */
export async function addDoc(collection, data) {
  const ref = await db.collection(collection).add(data);
  return { id: ref.id };
}

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE DOC — merges new fields into an existing document (non-destructive)
// Returns: void
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {string} collection - Firestore collection name
 * @param {string} id         - Document ID to update
 * @param {object} data       - Fields to update (only these fields are touched)
 * @returns {void}
 */
export async function updateDoc(collection, id, data) {
  await db.collection(collection).doc(id).update(data);
  return;
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE DOC — removes a single document by ID
// Returns: void
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {string} collection - Firestore collection name
 * @param {string} id         - Document ID to delete
 * @returns {void}
 */
export async function deleteDoc(collection, id) {
  await db.collection(collection).doc(id).delete();
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE COLLECTION — deletes ALL documents in a collection in batches
// Firestore does not support deleting collections directly, so this
// fetches and deletes in chunks of `batchSize` (default: 100).
// Returns: void
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {string} collection  - Firestore collection name to wipe
 * @param {number} [batchSize] - Docs to delete per batch (default: 100)
 * @returns {void}
 */
export async function deleteCollection(collection, batchSize = 100) {
  const collectionRef = db.collection(collection);

  async function deleteBatch() {
    const snapshot = await collectionRef.limit(batchSize).get();

    // Base case: nothing left to delete
    if (snapshot.empty) return;

    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    // Recurse until the collection is empty
    await deleteBatch();
  }

  await deleteBatch();
}

// ─────────────────────────────────────────────────────────────────────────────
// GET DOC — fetches a single document by ID
// Returns: { id: string, ...data } or null if not found
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {string} collection - Firestore collection name
 * @param {string} id         - Document ID to fetch
 * @returns {{ id: string, [key: string]: any } | null}
 */
export async function getDoc(collection, id) {
  const snap = await db.collection(collection).doc(id).get();
  if (!snap.exists) return null;
  return { ...snap.data() };
}

// ─────────────────────────────────────────────────────────────────────────────
// GET COLLECTION — fetches all documents in a collection
// Optionally accepts a list of where-clause filters
// Returns: Array of { id: string, ...data }
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {string} collection - Firestore collection name
 * @param {Array<[string, string, any]>} [filters] - Optional where filters
 *   Each filter is a tuple: [field, operator, value]
 *   e.g. [["role", "==", "admin"], ["active", "==", true]]
 * @returns {Array<{ id: string, [key: string]: any }>}
 */
export async function getCollection(collection, filters = []) {
  let query = db.collection(collection);

  for (const [field, operator, value] of filters) {
    query = query.where(field, operator, value);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
