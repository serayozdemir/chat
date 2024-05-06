import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcISIs98lSXtxkURFiszRdzRDuAEjOIwg",
  authDomain: "chat-f5916.firebaseapp.com",
  databaseURL: "https://chat-f5916-default-rtdb.firebaseio.com",
  projectId: "chat-f5916",
  storageBucket: "chat-f5916.appspot.com",
  messagingSenderId: "1054287125875",
  appId: "1:1054287125875:web:099e50a160df48de7cb906"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
