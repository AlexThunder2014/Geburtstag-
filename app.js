import {
    getDatabase,
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyACSnquBUpWqgUy9ck5nrICTCQZfq6pbM",
    authDomain: "dedektive-66ed9.firebaseapp.com",
    projectId: "dedektive-66ed9",
    storageBucket: "dedektive-66ed9.firebasestorage.app",
    messagingSenderId: "1033107065836",
    appId: "1:1033107065836:web:afee087737bfe62c6dcec9",
    databaseURL: "https://dedektive-66ed9-default-rtdb.europe-west1.firebasedatabase.app"
};

const status = document.getElementById("connectionStatus");
const message = document.getElementById("joinMessage");

try {

    status.textContent = "🟡 Firebase wird getestet...";

    const app = initializeApp(firebaseConfig);

    const database = getDatabase(app);

    const databaseRef = ref(database, "groups");

    const result = await get(databaseRef);

    status.textContent = "🟢 FIREBASE FUNKTIONIERT!";

    status.className = "connection-status online";

    message.className = "message success";

    message.textContent =
        "✅ Verbindung zu Firebase funktioniert!\n\n" +
        "Datenbank erreichbar.\n\n" +
        "Jetzt können wir die Gruppenfunktion aktivieren.";

    console.log("Firebase erfolgreich:", result.val());

} catch (error) {

    status.textContent = "🔴 FIREBASE FEHLER";

    status.className = "connection-status offline";

    message.className = "message error";

    message.style.whiteSpace = "pre-wrap";

    message.textContent =
        "❌ DER GENAU FEHLER IST:\n\n" +
        "Code: " +
        (error.code || "kein Code") +
        "\n\n" +
        "Nachricht:\n" +
        (error.message || error.toString());

    console.error(
        "KOMPLETTER FIREBASE FEHLER:",
        error
    );

}
