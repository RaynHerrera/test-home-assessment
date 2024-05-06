import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAaQE9L-LaUlZPgY5jH22aK98xznG0lJi4",
    authDomain: "testproject-540c8.firebaseapp.com",
    projectId: "testproject-540c8",
    storageBucket: "testproject-540c8.appspot.com",
    messagingSenderId: "604373898788",
    appId: "1:604373898788:web:ec6ebcc7dd1340878a6ab1"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
