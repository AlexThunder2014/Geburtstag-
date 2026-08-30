/* =========================================
   DETEKTIV-JAGD
   admin.js
   SPIELLEITER-ZENTRALE
   ========================================= */

const ADMIN_PIN = "141624";


/* =========================================
   ELEMENTE
   ========================================= */

const adminLogin =
    document.getElementById("adminLogin");

const adminDashboard =
    document.getElementById("adminDashboard");

const adminPassword =
    document.getElementById("adminPassword");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");

const adminTeamName =
    document.getElementById("adminTeamName");

const adminStation =
    document.getElementById("adminStation");

const adminAnswer =
    document.getElementById("adminAnswer");

const adminAnswerStatus =
    document.getElementById("adminAnswerStatus");

const adminMissionTitle =
    document.getElementById("adminMissionTitle");

const adminMissionClue =
    document.getElementById("adminMissionClue");

const adminActionMessage =
    document.getElementById("adminActionMessage");

const adminMessageInput =
    document.getElementById("adminMessageInput");

const sendMessageButton =
    document.getElementById("sendMessageButton");

const messageStatus =
    document.getElementById("messageStatus");

const finishGameButton =
    document.getElementById("finishGameButton");

const logoutButton =
    document.getElementById("logoutButton");


/* =========================================
   NEUE ADMIN-EINGABEN
   ========================================= */

const adminTitleInput =
    document.getElementById("adminTitleInput");

const adminClueInput =
    document.getElementById("adminClueInput");

const adminTaskInput =
    document.getElementById("adminTaskInput");

const adminSolutionInput =
    document.getElementById("adminSolutionInput");

const sendMissionButton =
    document.getElementById("sendMissionButton");

const missionSendStatus =
    document.getElementById("missionSendStatus");


/* =========================================
   LOGIN
   ========================================= */

if (loginButton) {

    loginButton.addEventListener(
        "click",
        login
    );

}


if (adminPassword) {

    adminPassword.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {
                login();
            }

        }
    );

}


function login() {

    const pin =
        adminPassword.value.trim();

    if (pin === ADMIN_PIN) {

        sessionStorage.setItem(
            "detektivAdmin",
            "true"
        );

        loginMessage.className =
            "message success";

        loginMessage.textContent =
            "✅ Zugang erlaubt!";

        setTimeout(
            showDashboard,
            300
        );

    } else {

        loginMessage.className =
            "message error";

        loginMessage.textContent =
            "❌ Falsche PIN!";

        adminPassword.value =
            "";

        adminPassword.focus();

    }

}


/* =========================================
   DASHBOARD ANZEIGEN
   ========================================= */

function showDashboard() {

    if (adminLogin) {
        adminLogin.classList.remove("active");
    }

    if (adminDashboard) {
        adminDashboard.classList.add("active");
    }

    updateDashboard();

}


/* =========================================
   DASHBOARD AKTUALISIEREN
   ========================================= */

function updateDashboard() {

    const team =
        localStorage.getItem(
            "detektivTeamName"
        );

    const station =
        localStorage.getItem(
            "detektivMission"
        );

    const answer =
        localStorage.getItem(
            "detektivAnswer"
        );

    const correct =
        localStorage.getItem(
            "detektivAnswerCorrect"
        );


    if (adminTeamName) {

        adminTeamName.textContent =
            team || "Noch kein Team";

    }


    if (adminStation) {

        if (station !== null) {

            adminStation.textContent =
                "Station " +
                (parseInt(station, 10) + 1);

        } else {

            adminStation.textContent =
                "-";

        }

    }


    if (adminAnswer) {

        adminAnswer.textContent =
            answer || "-";

    }


    if (adminAnswerStatus) {

        if (correct === "true") {

            adminAnswerStatus.textContent =
                "✅ Richtig";

        } else if (correct === "false") {

            adminAnswerStatus.textContent =
                "❌ Falsch";

        } else {

            adminAnswerStatus.textContent =
                "⏳ Wartet";

        }

    }


    loadSavedMission();

}


/* =========================================
   EIGENEN HINWEIS LADEN
   ========================================= */

function loadSavedMission() {

    const savedMission =
        localStorage.getItem(
            "detektivCustomMission"
        );

    if (!savedMission) {
        return;
    }

    try {

        const mission =
            JSON.parse(savedMission);


        if (adminTitleInput) {
            adminTitleInput.value =
                mission.title || "";
        }

        if (adminClueInput) {
            adminClueInput.value =
                mission.clue || "";
        }

        if (adminTaskInput) {
            adminTaskInput.value =
                mission.task || "";
        }

        if (adminSolutionInput) {
            adminSolutionInput.value =
                mission.answer || "";
        }


        if (adminMissionTitle) {

            adminMissionTitle.textContent =
                mission.title || "Eigener Hinweis";

        }


        if (adminMissionClue) {

            adminMissionClue.textContent =
                mission.clue || "---";

        }

    } catch (error) {

        console.error(
            "Eigener Hinweis konnte nicht geladen werden:",
            error
        );

    }

}


/* =========================================
   EIGENEN HINWEIS ABSCHICKEN
   ========================================= */

if (sendMissionButton) {

    sendMissionButton.addEventListener(
        "click",
        sendCustomMission
    );

}


function sendCustomMission() {

    const title =
        adminTitleInput
            ? adminTitleInput.value.trim()
            : "";

    const clue =
        adminClueInput
            ? adminClueInput.value.trim()
            : "";

    const task =
        adminTaskInput
            ? adminTaskInput.value.trim()
            : "";

    const answer =
        adminSolutionInput
            ? adminSolutionInput.value.trim()
            : "";


    /* Pflichtfelder prüfen */

    if (!title) {

        showMissionStatus(
            "❌ Bitte einen Titel eingeben.",
            "error"
        );

        return;
    }


    if (!clue) {

        showMissionStatus(
            "❌ Bitte einen Hinweis eingeben.",
            "error"
        );

        return;
    }


    if (!task) {

        showMissionStatus(
            "❌ Bitte eine Aufgabe eingeben.",
            "error"
        );

        return;
    }


    if (!answer) {

        showMissionStatus(
            "❌ Bitte eine Lösung eingeben.",
            "error"
        );

        return;
    }


    /* Eigene Mission erstellen */

    const customMission = {

        title: title,

        clue: clue,

        task: task,

        answer: answer,

        sentAt:
            new Date().toISOString()

    };


    /* Auf dem Gerät speichern */

    localStorage.setItem(
        "detektivCustomMission",
        JSON.stringify(customMission)
    );


    /* Status setzen */

    localStorage.setItem(
        "detektivCustomMissionActive",
        "true"
    );


    /* Vorschau aktualisieren */

    if (adminMissionTitle) {

        adminMissionTitle.textContent =
            title;

    }


    if (adminMissionClue) {

        adminMissionClue.textContent =
            clue;

    }


    showMissionStatus(
        "📡 Hinweis wurde abgeschickt!",
        "success"
    );

}


/* =========================================
   STATUS FÜR HINWEIS
   ========================================= */

function showMissionStatus(
    text,
    type
) {

    if (!missionSendStatus) {
        return;
    }

    missionSendStatus.className =
        "message " + type;

    missionSendStatus.textContent =
        text;

}


/* =========================================
   NACHRICHT AN TEAM
   ========================================= */

if (sendMessageButton) {

    sendMessageButton.addEventListener(
        "click",
        function() {

            const message =
                adminMessageInput.value.trim();


            if (!message) {

                messageStatus.className =
                    "message error";

                messageStatus.textContent =
                    "❌ Bitte zuerst eine Nachricht eingeben.";

                return;

            }


            localStorage.setItem(
                "detektivAdminMessage",
                message
            );


            localStorage.setItem(
                "detektivAdminMessageTime",
                new Date().toISOString()
            );


            messageStatus.className =
                "message success";

            messageStatus.textContent =
                "📡 Nachricht wurde abgeschickt.";


            adminMessageInput.value =
                "";

        }
    );

}


/* =========================================
   MISSION BEENDEN
   ========================================= */

if (finishGameButton) {

    finishGameButton.addEventListener(
        "click",
        function() {

            const confirmation =
                confirm(
                    "Schnitzeljagd wirklich beenden?"
                );


            if (!confirmation) {
                return;
            }


            localStorage.setItem(
                "detektivFinished",
                "true"
            );


            if (adminActionMessage) {

                adminActionMessage.className =
                    "message success";

                adminActionMessage.textContent =
                    "🏆 Mission beendet!";

            }

        }
    );

}


/* =========================================
   ADMIN VERLASSEN
   ========================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function() {

            sessionStorage.removeItem(
                "detektivAdmin"
            );

            window.location.href =
                "index.html";

        }
    );

}


/* =========================================
   AUTOMATISCH EINLOGGEN
   ========================================= */

if (
    sessionStorage.getItem(
        "detektivAdmin"
    ) === "true"
) {

    showDashboard();

}
