/* =========================================
   DETEKTIV-JAGD
   admin.js
   SPIELLEITER
   ========================================= */

const ADMIN_PIN = "1234";


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

const nextMissionButton =
    document.getElementById("nextMissionButton");

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
   LOGIN
   ========================================= */

loginButton.addEventListener(
    "click",
    login
);


adminPassword.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            login();
        }

    }
);


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
   DASHBOARD
   ========================================= */

function showDashboard() {

    adminLogin.classList.remove(
        "active"
    );

    adminDashboard.classList.add(
        "active"
    );

    updateDashboard();

}


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


    adminTeamName.textContent =
        team || "Noch kein Team";


    if (station !== null) {

        adminStation.textContent =
            "Station " +
            (parseInt(station, 10) + 1);

    } else {

        adminStation.textContent =
            "-";

    }


    adminAnswer.textContent =
        answer || "-";


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


    loadCurrentMission(
        station
    );

}


/* =========================================
   AKTUELLE MISSION
   ========================================= */

async function loadCurrentMission(
    station
) {

    try {

        const response =
            await fetch("missions.json");

        const missions =
            await response.json();

        let index =
            station === null
                ? 0
                : parseInt(station, 10);


        if (
            index < 0 ||
            index >= missions.length
        ) {

            adminMissionTitle.textContent =
                "Keine weitere Mission";

            adminMissionClue.textContent =
                "🏆 Die Schnitzeljagd ist beendet.";

            return;
        }


        const mission =
            missions[index];


        adminMissionTitle.textContent =
            mission.title;


        adminMissionClue.textContent =
            mission.clue;


    } catch (error) {

        console.error(error);

        adminMissionTitle.textContent =
            "Fehler";

        adminMissionClue.textContent =
            "missions.json konnte nicht geladen werden.";

    }

}


/* =========================================
   NÄCHSTE MISSION
   ========================================= */

nextMissionButton.addEventListener(
    "click",
    function() {

        const station =
            parseInt(
                localStorage.getItem(
                    "detektivMission"
                ) || "0",
                10
            );


        const next =
            station + 1;


        localStorage.setItem(
            "detektivMission",
            next
        );


        localStorage.removeItem(
            "detektivAnswer"
        );


        localStorage.removeItem(
            "detektivAnswerCorrect"
        );


        adminActionMessage.className =
            "message success";


        adminActionMessage.textContent =
            "🚀 Nächste Station freigeschaltet!";


        updateDashboard();

    }
);


/* =========================================
   NACHRICHT SENDEN
   ========================================= */

sendMessageButton.addEventListener(
    "click",
    function() {

        const message =
            adminMessageInput.value.trim();


        if (!message) {

            messageStatus.className =
                "message error";

            messageStatus.textContent =
                "Bitte zuerst eine Nachricht eingeben.";

            return;
        }


        localStorage.setItem(
            "detektivAdminMessage",
            message
        );


        messageStatus.className =
            "message success";

        messageStatus.textContent =
            "📡 Nachricht gespeichert.";


        adminMessageInput.value =
            "";

    }
);


/* =========================================
   SPIEL BEENDEN
   ========================================= */

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


        adminActionMessage.className =
            "message success";

        adminActionMessage.textContent =
            "🏆 Mission beendet!";

    }
);


/* =========================================
   LOGOUT
   ========================================= */

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
