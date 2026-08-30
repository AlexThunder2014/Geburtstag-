// ============================================
// DETEKTIV-JAGD
// APP.JS
// ============================================

let DB = null;

let currentGroupId = null;
let currentTeamName = null;


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
// FIREBASE STARTEN
// ============================================

function startFirebase() {

    if (
        !window.DetektivDB ||
        !window.DetektivDB.database
    ) {

        console.error(
            "Firebase wurde nicht geladen."
        );

        if (connectionStatus) {

            connectionStatus.textContent =
                "🔴 Verbindung zur Zentrale fehlgeschlagen";

        }

        return false;
    }


    DB = window.DetektivDB;


    if (connectionStatus) {

        connectionStatus.textContent =
            "🟢 Verbindung zur Zentrale hergestellt";

        connectionStatus.className =
            "connection-status online";

    }


    if (joinButton) {

        joinButton.disabled = false;

    }


    console.log(
        "🔥 Firebase erfolgreich verbunden"
    );


    return true;
}


// ============================================
// GRUPPE BETRETEN
// ============================================

async function joinGroup() {

    const teamInput =
        document.getElementById("teamInput");

    const pinInput =
        document.getElementById("groupPinInput");


    const teamName =
        teamInput ?
        teamInput.value.trim() :
        "";


    const pin =
        pinInput ?
        pinInput.value.trim() :
        "";


    if (!teamName) {

        showMessage(
            "❌ Bitte einen Teamnamen eingeben.",
            "error"
        );

        return;
    }


    if (!pin) {

        showMessage(
            "❌ Bitte den Gruppen-PIN eingeben.",
            "error"
        );

        return;
    }


    if (!DB) {

        if (!startFirebase()) {

            showMessage(
                "❌ Verbindung zur Zentrale fehlgeschlagen.",
                "error"
            );

            return;
        }
    }


    try {

        if (joinButton) {

            joinButton.disabled = true;

        }


        showMessage(
            "🔎 Gruppe wird gesucht...",
            ""
        );


        const groupsReference =
            DB.ref(
                DB.database,
                "groups"
            );


        const snapshot =
            await DB.get(
                groupsReference
            );


        const groups =
            snapshot.val() || {};


        let foundGroup = null;


        for (
            const groupId in groups
        ) {

            const group =
                groups[groupId];


            if (
                group &&
                String(group.pin) ===
                String(pin)
            ) {

                foundGroup = {

                    id: groupId,
                    data: group

                };

                break;
            }
        }


        if (!foundGroup) {

            showMessage(
                "❌ Keine Gruppe mit diesem PIN gefunden.",
                "error"
            );

            if (joinButton) {

                joinButton.disabled = false;

            }

            return;
        }


        currentGroupId =
            foundGroup.id;

        currentTeamName =
            teamName;


        // Team in Firebase speichern

        await DB.update(

            DB.ref(
                DB.database,
                "groups/" +
                currentGroupId
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


        // Für die nächste Seite merken

        sessionStorage.setItem(
            "detektivGroupId",
            currentGroupId
        );


        sessionStorage.setItem(
            "detektivTeamName",
            currentTeamName
        );


        showMessage(
            "✅ Gruppe erfolgreich betreten!",
            "success"
        );


        // Falls eine Spielseite existiert,
        // kann sie hier geöffnet werden.

        setTimeout(() => {

            if (
                document.body.dataset.gamePage ===
                "true"
            ) {

                return;

            }


            // Nur weiterleiten, wenn
            // game.html vorhanden sein soll.

            // window.location.href = "game.html";

        }, 500);


    } catch (error) {

        console.error(
            "Firebase Fehler:",
            error
        );


        showMessage(
            "❌ Verbindung zur Zentrale fehlgeschlagen.\n\n" +
            "Fehler: " +
            (error.message || error),
            "error"
        );


        if (joinButton) {

            joinButton.disabled = false;

        }

    }

}


// ============================================
// NACHRICHT ANZEIGEN
// ============================================

function showMessage(
    text,
    type
) {

    if (!joinMessage) {

        return;
    }


    joinMessage.textContent =
        text;


    joinMessage.className =
        "message";


    if (type) {

        joinMessage.classList.add(
            type
        );

    }

}


// ============================================
// ADMIN / GRUPPENFUNKTIONEN
// ============================================

async function createGroup(
    groupName,
    pin
) {

    if (!DB) {

        startFirebase();

    }


    if (!groupName || !pin) {

        return null;

    }


    try {

        const groupsReference =
            DB.ref(
                DB.database,
                "groups"
            );


        const newGroup =
            DB.push(
                groupsReference
            );


        const groupData = {

            name:
                groupName,

            pin:
                String(pin),

            teamName:
                "",

            online:
                false,

            createdAt:
                Date.now(),

            lastSeen:
                Date.now(),

            currentStation:
                0

        };


        await DB.set(
            newGroup,
            groupData
        );


        return newGroup.key;

    } catch (error) {

        console.error(
            "Gruppe konnte nicht erstellt werden:",
            error
        );

        return null;

    }

}


// ============================================
// GRUPPE BEOBACHTEN
// ============================================

function watchGroup(
    groupId,
    callback
) {

    if (!DB || !groupId) {

        return null;

    }


    const groupReference =
        DB.ref(
            DB.database,
            "groups/" +
            groupId
        );


    return DB.onValue(
        groupReference,
        snapshot => {

            const data =
                snapshot.val();


            if (callback) {

                callback(data);

            }

        }
    );

}


// ============================================
// GRUPPE LÖSCHEN
// ============================================

async function deleteGroup(
    groupId
) {

    if (!DB || !groupId) {

        return false;

    }


    try {

        await DB.remove(

            DB.ref(
                DB.database,
                "groups/" +
                groupId
            )

        );


        return true;

    } catch (error) {

        console.error(
            error
        );


        return false;

    }

}


// ============================================
// BUTTON
// ============================================

if (joinButton) {

    joinButton.addEventListener(
        "click",
        joinGroup
    );

}


// ============================================
// ENTER-TASTE
// ============================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            document.activeElement &&
            (
                document.activeElement.id ===
                "teamInput" ||

                document.activeElement.id ===
                "groupPinInput"
            )
        ) {

            joinGroup();

        }

    }
);


// ============================================
// START
// ============================================

window.addEventListener(
    "load",
    () => {

        startFirebase();

    }
);
