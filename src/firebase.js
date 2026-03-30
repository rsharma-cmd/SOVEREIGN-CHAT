import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCEAsksP4oMTMdTPXrQN-GSGgOgRW3BZDg",
  authDomain: "sovereign-chat-7b8b0.firebaseapp.com",
  projectId: "sovereign-chat-7b8b0",
  storageBucket: "sovereign-chat-7b8b0.firebasestorage.app",
  messagingSenderId: "1076556767935",
  appId: "1:1076556767935:web:001766048ca88aed1b1c0a"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const rtdb = getDatabase(app)
export const storage = getStorage(app)

export default app