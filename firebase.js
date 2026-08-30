import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    get,
    update,
    remove,
    onValue,
    push
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyACSnquBUpWqgUy9ck5nrICTCQZfq6pbpM",
    authDomain: "dedektive-66ed9.firebaseapp.com",
    projectId: "dedektive-66ed9",
    storageBucket: "dedektive-66ed9.firebasestorage.app",
    messagingSenderId: "1033107065836",
    appId: "1:1033107065836:web:afee087737bfe62c6dcec9",
    databaseURL: "https://dedektive-66ed9-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

window.DetektivDB = {
    app,
    database,
    ref,
    set,
    get,
    update,
    remove,
    onValue,
    push
};

console.log("🔥 Firebase erfolgreich verbunden");
