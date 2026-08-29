/* =========================================
   DETEKTIV-JAGD
   app.js
   Kinderbereich
   ========================================= */

let missions = [];
let currentMission = 0;
let teamName = "";


/* =========================================
   ELEMENTE
   ========================================= */

const startScreen = document.getElementById("startScreen");
const missionScreen = document.getElementById("missionScreen");
const waitingScreen = document.getElementById("waitingScreen");
const finishScreen = document.getElementById("finishScreen");

const teamInput = document.getElementById("teamInput");
const startButton = document.getElementById("startButton");

const teamNameDisplay = document.getElementById("teamName");

const missionTitle = document.getElementById("missionTitle");
const stationNumber = document.getElementById("stationNumber");

const clueText = document.getElementById("clueText");
const taskText = document.getElementById("taskText");

const answerInput = document.getElementById("answerInput");
const answerButton = document.getElementById("answerButton");
const answerMessage = document.getElementById("answerMessage");


/* =========================================
   HILFSFUNKTION
   ========================================= */

function showScreen(screen) {

    startScreen.classList.remove("active");
    missionScreen.classList.remove("active");
    waitingScreen.classList.remove("active");
    finishScreen.classList.remove("active");

    screen.classList.add("active");
}


/* =========================================
   MISSIONEN LADEN
   ========================================= */

async function loadMissions() {

    try {

        const response = await fetch("missions.json");

        if (!response.ok) {
            throw new Error("missions.json konnte nicht geladen werden.");
        }

        missions = await response.json();

        console.log("Missionen geladen:", missions);

    } catch (error) {

        console.error(error);

        clueText.textContent =
            "Die Missionen konnten nicht geladen werden.";

    }
}


/* =========================================
   TEAM STARTET
   ========================================= */

startButton.addEventListener("click", startGame);


teamInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        startGame();
    }

});


function startGame() {

    const name = teamInput.value.trim();

    if (!name) {

        teamInput.focus();

        return;
    }

    if (missions.length === 0) {

        alert(
            "Die Missionen sind noch nicht geladen."
        );

        return;
    }

    teamName = name;

    teamNameDisplay.textContent = teamName;

    currentMission = 0;

    localStorage.setItem(
        "detektivTeamName",
        teamName
    );

    localStorage.setItem(
        "detektivMission",
        currentMission
    );

    showMission();

}


/* =========================================
   MISSION ANZEIGEN
   ========================================= */

function showMission() {

    if (
        currentMission < 0 ||
        currentMission >= missions.length
    ) {

        finishGame();

        return;
    }

    const mission = missions[currentMission];

    missionTitle.textContent =
        mission.title;

    stationNumber.textContent =
        currentMission + 1;

    clueText.textContent =
        mission.clue;

    taskText.textContent =
        mission.task;

    answerInput.value = "";

    answerMessage.className = "message";

    answerMessage.textContent = "";

    showScreen(missionScreen);

}


/* =========================================
   LÖSUNG PRÜFEN
   ========================================= */

answerButton.addEventListener(
    "click",
    checkAnswer
);


answerInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            checkAnswer();
        }

    }
);


function checkAnswer() {

    const answer =
        answerInput.value.trim();

    if (!answer) {

        answerMessage.className =
            "message error";

        answerMessage.textContent =
            "🔎 Gebt zuerst eine Lösung ein.";

        return;
    }


    const mission =
        missions[currentMission];


    const correctAnswer =
        String(mission.answer)
            .trim()
            .toLowerCase();


    const playerAnswer =
        answer
            .toLowerCase();


    if (playerAnswer === correctAnswer) {

        answerMessage.className =
            "message success";

        answerMessage.textContent =
            "✅ Richtig! Der Hinweis wurde gelöst.";

        /*
         * Die nächste Station wird noch NICHT
         * sofort angezeigt.
         *
         * Später entscheidet dein Admin-Gerät,
         * wann der nächste Hinweis freigeschaltet wird.
         */

        localStorage.setItem(
            "detektivAnswer",
            answer
        );

        localStorage.setItem(
            "detektivAnswerCorrect",
            "true"
        );

        setTimeout(
            showWaitingScreen,
            1200
        );

    } else {

        answerMessage.className =
            "message error";

        answerMessage.textContent =
            "❌ Leider falsch. Versucht es noch einmal.";

        localStorage.setItem(
            "detektivAnswer",
            answer
        );

        localStorage.setItem(
            "detektivAnswerCorrect",
            "false"
        );

    }

}


/* =========================================
   WARTEN
   ========================================= */

function showWaitingScreen() {

    showScreen(waitingScreen);

}


/* =========================================
   NÄCHSTE MISSION
   ========================================= */

function nextMission() {

    currentMission++;

    localStorage.setItem(
        "detektivMission",
        currentMission
    );

    if (currentMission >= missions.length) {

        finishGame();

        return;
    }

    showMission();

}


/* =========================================
   SPIEL BEENDET
   ========================================= */

function finishGame() {

    localStorage.setItem(
        "detektivFinished",
        "true"
    );

    showScreen(finishScreen);

}


/* =========================================
   AUTOMATISCHEN STATUS LADEN
   ========================================= */

function restoreGame() {

    const savedTeam =
        localStorage.getItem(
            "detektivTeamName"
        );

    const savedMission =
        localStorage.getItem(
            "detektivMission"
        );

    const finished =
        localStorage.getItem(
            "detektivFinished"
        );


    if (savedTeam) {

        teamName = savedTeam;

        teamNameDisplay.textContent =
            teamName;

        teamInput.value =
            teamName;
    }


    if (savedMission !== null) {

        currentMission =
            parseInt(savedMission, 10);

    }


    if (finished === "true") {

        finishGame();

    }

}


/* =========================================
   START
   ========================================= */

async function init() {

    await loadMissions();

    restoreGame();

}


init();

const adminAccessButton =
    document.getElementById("adminAccessButton");

adminAccessButton.addEventListener("click", function () {

    const password = prompt("🔐 Admin-Passwort:");

    if (password === "DEIN_PASSWORT") {
        window.location.href = "admin.html";
    } else {
        alert("❌ Falsches Passwort!");
    }

});
