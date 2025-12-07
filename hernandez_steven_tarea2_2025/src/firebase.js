import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBFCH2DNC1HYlLEnQRNL9iBlUVefxUvb8M",
  authDomain: "hernandez-steven-tarea2-2025.firebaseapp.com",
  databaseURL: "https://hernandez-steven-tarea2-2025-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hernandez-steven-tarea2-2025",
  storageBucket: "hernandez-steven-tarea2-2025.firebasestorage.app",
  messagingSenderId: "602359379158",
  appId: "1:602359379158:web:f81af37c6ba03105c40577",
  measurementId: "G-0TFT9FPQRF"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);  

export { database };