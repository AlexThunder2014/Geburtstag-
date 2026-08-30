// ============================================
// DETEKTIV-JAGD
// FIREBASE VERBINDUNGSTEST
// ============================================

let database = null;
let Firebase = null;


// ============================================
// ELEMENTE
// ============================================

const connectionStatus =
    document.getElementById("connectionStatus");

const joinButton =
    document.getElementById("joinButton");

const joinMessage =
    document.getElementById("joinMessage");


// ============================================
// FIREBASE WARTEN
// ============================================

function waitForFirebase() {

    return new Promise((resolve, reject) => {

        let attempts = 0;

        const timer = setInterval(() => {

            attempts++;

            if (
                window.DetektivDB &&
                window.DetektivDB.database
            ) {

                clearInterval(timer);

                resolve(
                    window.DetektivDB
                );

                return;
            }


            // Nach 10 Sekunden abbrechen

            if (attempts >= 100) {

                clearInterval(timer);

                reject(
                    new Error(
                        "Firebase wurde nicht gefunden."
                    )
                );

            }

        }, 100);

    });

}


// ============================================
// FIREBASE VERBINDUNGSTEST
// ============================================

async function testFirebase() {

    try {

        connectionStatus.textContent =
            "🟡 Firebase wird getestet...";

        connectionStatus.className =
            "connection-status";


        Firebase =
            await waitForFirebase();


        database =
            Firebase.database;


        console.log(
            "🔥 Firebase Objekt:",
            Firebase
        );


        console.log(
            "🔥 Datenbank:",
            database
        );


        // Test: groups lesen

        const groupsRef =
            Firebase.ref(
                database,
                "groups"
            );


        const snapshot =
            await Firebase.get(
                groupsRef
            );


        console.log(
            "🔥 Firebase Test erfolgreich:",
            snapshot.val()
        );


        connectionStatus.textContent =
            "🟢 Firebase verbunden";

        connectionStatus.className =
            "connection-status online";


        joinButton.disabled =
            false;


        return true;


    } catch (error) {

        console.error(
            "🔥 FIREBASE FEHLER:",
            error
        );


        connectionStatus.textContent =
            "🔴 Firebase-Fehler";


        connectionStatus.className =
            "connection-status offline";


        joinButton.disabled =
            false;


        showDetailedError(
            error
        );


        return false;

    }

}


// ============================================
// FEHLER ANZEIGEN
// ============================================

function showDetailedError(error) {

    let message =
        "❌ Firebase-Verbindung fehlgeschlagen.";


    if (error) {

        if (error.code) {

            message +=
                "\n\nFehlercode: " +
                error.code;

        }


        if (error.message) {

            message +=
                "\n\n" +
                error.message;

        }

    }


    joinMessage.className =
        "message error";


    joinMessage.style.whiteSpace =
        "pre-wrap";


    joinMessage.textContent =
        message;

}


// ============================================
// GRUPPE BETRETEN
// ============================================

joinButton.addEventListener(
    "click",
    joinGroup
);


async function joinGroup() {

    const teamName =
        document.getElementById(
            "teamInput"
        ).value.trim();


    const pin =
        document.getElementById(
            "groupPinInput"
        ).value.trim();


    if (!teamName) {

        joinMessage.className =
            "message error";

        joinMessage.textContent =
            "❌ Bitte einen Teamnamen eingeben.";

        return;

    }


    if (!pin) {

        joinMessage.className =
            "message error";

        joinMessage.textContent =
            "❌ Bitte eine Gruppen-PIN eingeben.";

        return;

    }


    // Noch einmal Verbindung prüfen

    const connected =
        await testFirebase();


    if (!connected) {

        return;

    }


    try {

        joinButton.disabled =
            true;


        joinMessage.className =
            "message";


        joinMessage.textContent =
            "🔎 Gruppe wird gesucht...";


        const groupsRef =
            Firebase.ref(
                database,
                "groups"
            );


        const snapshot =
            await Firebase.get(
                groupsRef
            );


        const groups =
            snapshot.val() || {};


        let foundGroup = null;


        for (
            const id in groups
        ) {

            const group =
                groups[id];


            if (
                String(group.pin) ===
                String(pin)
            ) {

                foundGroup = {

                    id,
                    data: group

                };

                break;

            }

        }


        if (!foundGroup) {

            joinMessage.className =
                "message error";

            joinMessage.textContent =
                "❌ Keine Gruppe mit dieser PIN gefunden.";

            joinButton.disabled =
                false;

            return;

        }


        // Gruppe gefunden

        await Firebase.update(

            Firebase.ref(
                database,
                "groups/" +
                foundGroup.id
            ),

            {

                teamName:
                    teamName,

                online:
                    true,

                lastSeen:
                    Date.now()

            }

        );


        sessionStorage.setItem(
            "detektivGroupId",
            foundGroup.id
        );


        sessionStorage.setItem(
            "detektivTeamName",
            teamName
        );


        joinMessage.className =
            "message success";


        joinMessage.textContent =
            "✅ Verbindung funktioniert! Gruppe gefunden.";


    } catch (error) {

        console.error(
            "🔥 Fehler beim Gruppenbeitritt:",
            error
        );


        showDetailedError(
            error
        );


        joinButton.disabled =
            false;

    }

}


// ============================================
// START
// ============================================

joinButton.disabled =
    true;


testFirebase();
