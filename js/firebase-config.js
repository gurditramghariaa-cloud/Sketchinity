// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDM4Dq-HIhijUDFYuhU6opLZCPxqQGqOqY",
  authDomain: "sketchinity-f37db.firebaseapp.com",
  databaseURL: "https://sketchinity-f37db-default-rtdb.firebaseio.com",
  projectId: "sketchinity-f37db",
  storageBucket: "sketchinity-f37db.firebasestorage.app",
  messagingSenderId: "617264077695",
  appId: "1:617264077695:web:fd8d4134a6dc1dad3ad84a",
  measurementId: "G-DV0VTBKSVB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
