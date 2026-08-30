// ============================================
// DETEKTIV-JAGD
// FIREBASE VERBINDUNG
// ============================================

import { initializeApp }
    from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

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


// ============================================
// FIREBASE KONFIGURATION
// ============================================

const firebaseConfig = {

    apiKey:
        "AIzaSyACSnquBUpWqgUy9ck5nrICTCQZfq6pbpM",

    authDomain:
        "dedektive-66ed9.firebaseapp.com",

    projectId:
        "dedektive-66ed9",

    storageBucket:
        "dedektive-66ed9.firebasestorage.app",

    messagingSenderId:
        "1033107065836",

    appId:
        "1:1033107065836:web:afee087737bfe62c6dcec9",

    databaseURL:
        "https://dedektive-66ed9-default-rtdb.europe-west1.firebasedatabase.app/"

};


// ============================================
// FIREBASE STARTEN
// ============================================

const app =
    initializeApp(firebaseConfig);


// ============================================
// REALTIME DATABASE STARTEN
// ============================================

const database =
    getDatabase(app);


// ============================================
// FÜR APP.JS UND ADMIN.JS BEREITSTELLEN
// ============================================

window.DetektivDB = {

    app: app,

    database: database,

    ref: ref,

    set: set,

    get: get,

    update: update,

    remove: remove,

    onValue: onValue,

    push: push

};


console.log(
    "🔥 Firebase erfolgreich verbunden!"
);

console.log(
    "🗄️ Realtime Database:",
    database
);
