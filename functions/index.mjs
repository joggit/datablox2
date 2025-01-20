/**
 * Import function triggers from their respective submodules:
 *
 * const { onCall } = require("firebase-functions/v2/https");
 * const { onDocumentWritten } = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { auth } from "firebase-functions/v1"; // Import v1 triggers for Firebase Auth
import admin from "firebase-admin";

admin.initializeApp();

// Simple HTTPS function
export const helloWorld = onRequest((req, res) => {
  logger.info("Hello logs!", { structuredData: true });
  res.send("Hello from Firebase!");
});

// Cloud Function to trigger on user creation
export const createUserInFirestore = auth.user().onCreate(async (user) => {
  try {
    const userRef = admin.firestore().collection("users").doc(user.uid);

    // Default user data
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "Anonymous",
      photoURL: user.photoURL || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Add user data to Firestore
    await userRef.set(userData);

    logger.info(`User document created for UID: ${user.uid}`);
  } catch (error) {
    logger.error("Error creating user document:", error);
  }
});
