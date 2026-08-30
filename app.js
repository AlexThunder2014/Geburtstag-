// ============================================
// DETEKTIV-JAGD
// KINDERSEITE
// ============================================

let database = null;
let groupId = null;
let teamName = "";


// ============================================
// ELEMENTE
// ============================================

const startScreen =
    document.getElementById("startScreen");

const missionScreen =
    document.getElementById("missionScreen");

const waitingScreen =
    document.getElementById("waitingScreen");

const finishScreen =
    document.getElementById("finishScreen");


const teamInput =
    document.getElementById("teamInput");

const groupPinInput =
    document.getElementById("groupPinInput");

const joinButton =
    document.getElementById("joinButton");

const joinMessage =
    document.getElementById("joinMessage");


const teamNameDisplay =
    document.getElementById("teamName");

const missionTitle =
    document.getElementById("missionTitle");

const stationNumber =
    document.getElementById("stationNumber");

const clueText =
    document.getElementById("clueText");

const taskText =
    document.getElementById("taskText");


const answerInput =
    document.getElementById("answerInput");

const answerButton =
    document.getElementById("answerButton");

const answerMessage =
    document.getElementById("answerMessage");


const adminMessage =
    document.getElementById("adminMessage");

const connectionStatus =
    document.getElementById("connectionStatus");


// ============================================
// FIREBASE WARTEN
// ============================================

function waitForFirebase() {

    return new Promise(resolve => {

        const timer =
            setInterval(() => {

                if (
                    window.DetektivDB &&
                    window.DetektivDB.database
                ) {

                    clearInterval(timer);

                    resolve(
                        window.DetektivDB
                    );

                }

            }, 100);

    });

}


// ============================================
// SCREEN WECHSELN
// ============================================

function showScreen(screen) {

    [
        startScreen,
        missionScreen,
        waitingScreen,
        finishScreen
    ]
    .forEach(element => {

        if (element) {

            element.classList.remove(
                "active"
            );

        }

    });


    if (screen) {

        screen.classList.add(
            "active"
        );

    }

}


// ============================================
// VERBINDUNG
// ============================================

async function initializeConnection() {

    try {

        const Firebase =
            await waitForFirebase();

        database =
            Firebase.database;


        connectionStatus.textContent =
            "🟢 Online";

        connectionStatus.className =
            "connection-status online";


        restoreSession();

    } catch (error) {

        console.error(error);

        connectionStatus.textContent =
            "🔴 Keine Verbindung";

        connectionStatus.className =
            "connection-status offline";

    }

}


initializeConnection();


// ============================================
// GRUPPE BEITRETEN
// ============================================

joinButton.addEventListener(
    "click",
    joinGroup
);


groupPinInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            joinGroup();

        }

    }
);


teamInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            groupPinInput.focus();

        }

    }
);


async function joinGroup() {

    teamName =
        teamInput.value.trim();

    const pin =
        groupPinInput.value.trim();


    if (!teamName) {

        showJoinError(
            "❌ Bitte einen Teamnamen eingeben."
        );

        return;

    }


    if (!pin) {

        showJoinError(
            "❌ Bitte die Gruppen-PIN eingeben."
        );

        return;

    }


    if (!database) {

        showJoinError(
            "❌ Die Verbindung ist noch nicht bereit."
        );

        return;

    }


    joinButton.disabled =
        true;


    try {

        const Firebase =
            window.DetektivDB;


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


        let foundGroup =
            null;


        for (
            const id in groups
        ) {

            const group =
                groups[id];


            if (
                String(group.pin) ===
                String(pin) &&
                group.deleted !== true
            ) {

                foundGroup = {
                    id,
                    data: group
                };

                break;

            }

        }


        if (!foundGroup) {

            showJoinError(
                "❌ Diese Gruppen-PIN gibt es nicht."
            );

            joinButton.disabled =
                false;

            return;

        }


        groupId =
            foundGroup.id;


        await Firebase.update(

            Firebase.ref(
                database,
                "groups/" + groupId
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
            groupId
        );


        sessionStorage.setItem(
            "detektivTeamName",
            teamName
        );


        teamNameDisplay.textContent =
            teamName;


        joinMessage.textContent =
            "✅ Gruppe verbunden!";


        joinMessage.className =
            "message success";


        listenToGroup();


    } catch (error) {

        console.error(error);

        showJoinError(
            "⚠️ Verbindung zur Zentrale fehlgeschlagen."
        );

        joinButton.disabled =
            false;

    }

}


// ============================================
// SESSION WIEDERHERSTELLEN
// ============================================

async function restoreSession() {

    const savedGroup =
        sessionStorage.getItem(
            "detektivGroupId"
        );

    const savedTeam =
        sessionStorage.getItem(
            "detektivTeamName"
        );


    if (
        !savedGroup ||
        !savedTeam
    ) {

        return;

    }


    try {

        const Firebase =
            window.DetektivDB;


        const groupRef =
            Firebase.ref(
                database,
                "groups/" + savedGroup
            );


        const snapshot =
            await Firebase.get(
                groupRef
            );


        if (
            !snapshot.exists()
        ) {

            sessionStorage.clear();

            return;

        }


        const group =
            snapshot.val();


        if (
            group.deleted === true
        ) {

            sessionStorage.clear();

            return;

        }


        groupId =
            savedGroup;

        teamName =
            savedTeam;


        teamInput.value =
            savedTeam;

        groupPinInput.value =
            group.pin || "";


        teamNameDisplay.textContent =
            savedTeam;


        await Firebase.update(
            groupRef,
            {

                online:
                    true,

                lastSeen:
                    Date.now()

            }
        );


        listenToGroup();

    } catch (error) {

        console.error(error);

    }

}


// ============================================
// GRUPPE LIVE ANHÖREN
// ============================================

function listenToGroup() {

    const Firebase =
        window.DetektivDB;


    const groupRef =
        Firebase.ref(
            database,
            "groups/" + groupId
        );


    Firebase.onValue(
        groupRef,
        snapshot => {

            const group =
                snapshot.val();


            if (!group) {

                alert(
                    "❌ Diese Gruppe wurde gelöscht."
                );


                sessionStorage.clear();

                location.reload();

                return;

            }


            if (
                group.deleted === true
            ) {

                alert(
                    "❌ Diese Gruppe wurde vom Spielleiter gelöscht."
                );


                sessionStorage.clear();

                location.reload();

                return;

            }


            updateFromGroup(group);

        }
    );

}


// ============================================
// GRUPPENDATEN VERARBEITEN
// ============================================

function updateFromGroup(group) {

    if (group.teamName) {

        teamNameDisplay.textContent =
            group.teamName;

    }


    if (group.finished === true) {

        showScreen(
            finishScreen
        );

        return;

    }


    const mission =
        group.currentMission;


    if (
        !mission ||
        mission.active !== true
    ) {

        showScreen(
            waitingScreen
        );

    } else {

        missionTitle.textContent =
            mission.title || "Mission";


        stationNumber.textContent =
            mission.station || "—";


        clueText.textContent =
            mission.clue || "";


        taskText.textContent =
            mission.task || "";


        showScreen(
            missionScreen
        );

    }


    if (group.adminMessage) {

        adminMessage.textContent =
            group.adminMessage;

    } else {

        adminMessage.textContent =
            "Keine neue Nachricht.";

    }


    if (group.answer) {

        if (
            group.answer.correct === true
        ) {

            answerMessage.className =
                "message success";

            answerMessage.textContent =
                "✅ Eure Lösung war richtig!";

        }

        if (
            group.answer.correct === false
        ) {

            answerMessage.className =
                "message error";

            answerMessage.textContent =
                "❌ Noch nicht richtig. Versucht es erneut.";

            answerButton.disabled =
                false;

        }

    }

}


// ============================================
// LÖSUNG ABSCHICKEN
// ============================================

answerButton.addEventListener(
    "click",
    sendAnswer
);


answerInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            sendAnswer();

        }

    }
);


async function sendAnswer() {

    const answer =
        answerInput.value.trim();


    if (!answer) {

        answerMessage.className =
            "message error";

        answerMessage.textContent =
            "❌ Bitte eine Lösung eingeben.";

        return;

    }


    if (!groupId) {

        return;

    }


    const Firebase =
        window.DetektivDB;


    try {

        const missionRef =
            Firebase.ref(
                database,
                "groups/" +
                groupId +
                "/currentMission"
            );


        const snapshot =
            await Firebase.get(
                missionRef
            );


        const mission =
            snapshot.val();


        if (!mission) {

            return;

        }


        await Firebase.set(

            Firebase.ref(
                database,
                "groups/" +
                groupId +
                "/answer"
            ),

            {

                text:
                    answer,

                correct:
                    null,

                station:
                    mission.station,

                time:
                    Date.now()

            }

        );


        answerButton.disabled =
            true;


        answerMessage.className =
            "message success";

        answerMessage.textContent =
            "📡 Antwort wurde abgeschickt.";


        showScreen(
            waitingScreen
        );


    } catch (error) {

        console.error(error);

        answerMessage.className =
            "message error";

        answerMessage.textContent =
            "⚠️ Antwort konnte nicht gesendet werden.";

    }

}


// ============================================
// FEHLER
// ============================================

function showJoinError(text) {

    joinMessage.className =
        "message error";

    joinMessage.textContent =
        text;

}
