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
// DEIN FIREBASE PROJEKT
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyACSnquBUpWqgUy9ck5nrICTCQZfq6pbpM",
    authDomain: "dedektive-66ed9.firebaseapp.com",
    projectId: "dedektive-66ed9",
    storageBucket: "dedektive-66ed9.firebasestorage.app",
    messagingSenderId: "1033107065836",
    appId: "1:1033107065836:web:afee087737bfe62c6dcec9"

    // databaseURL kommt noch dazu,
    // sobald du die Realtime Database erstellt hast.
};


// ============================================
// FIREBASE STARTEN
// ============================================

const app = initializeApp(firebaseConfig);


// ============================================
// DATENBANK
// ============================================

let database;

try {

    database = getDatabase(app);

} catch (error) {

    console.error(
        "Firebase-Datenbank konnte nicht gestartet werden:",
        error
    );

}


// ============================================
// GLOBAL VERFÜGBAR
// ============================================

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


console.log("🔥 Detektiv-Jagd Firebase geladen");
