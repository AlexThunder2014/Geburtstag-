/* =========================================
   DETEKTIV-JAGD
   app.js
   KINDERBEREICH
   ========================================= */

let missions = [];
let currentMission = 0;
let teamName = "";


/* =========================================
   ELEMENTE
   ========================================= */

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

const startButton =
    document.getElementById("startButton");

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

const gameStatus =
    document.getElementById("gameStatus");


/* =========================================
   BILDSCHIRM WECHSELN
   ========================================= */

function showScreen(screen) {

    [
        startScreen,
        missionScreen,
        waitingScreen,
        finishScreen
    ].forEach(function(element) {

        if (element) {
            element.classList.remove("active");
        }

    });

    if (screen) {
        screen.classList.add("active");
    }

}


/* =========================================
   MISSIONEN LADEN
   ========================================= */

async function loadMissions() {

    try {

        const response =
            await fetch("missions.json");

        if (!response.ok) {
            throw new Error(
                "missions.json konnte nicht geladen werden."
            );
        }

        missions =
            await response.json();

        console.log(
            "✅ Missionen geladen:",
            missions
        );

    } catch (error) {

        console.error(error);

        if (clueText) {

            clueText.textContent =
                "⚠️ Die Missionen konnten nicht geladen werden.";

        }

        if (startButton) {

            startButton.disabled = true;

        }

    }

}


/* =========================================
   SPIEL STARTEN
   ========================================= */

if (startButton) {

    startButton.addEventListener(
        "click",
        startGame
    );

}


if (teamInput) {

    teamInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {
                startGame();
            }

        }
    );

}


function startGame() {

    const name =
        teamInput.value.trim();

    if (!name) {

        alert(
            "🔎 Bitte gebt zuerst euren Teamnamen ein."
        );

        teamInput.focus();

        return;
    }

    if (missions.length === 0) {

        alert(
            "⚠️ Die Missionen sind noch nicht geladen."
        );

        return;
    }

    teamName =
        name;

    currentMission =
        0;

    localStorage.setItem(
        "detektivTeamName",
        teamName
    );

    localStorage.setItem(
        "detektivMission",
        currentMission
    );

    localStorage.removeItem(
        "detektivFinished"
    );

    teamNameDisplay.textContent =
        teamName;

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

    const mission =
        missions[currentMission];

    missionTitle.textContent =
        mission.title;

    stationNumber.textContent =
        currentMission + 1;

    clueText.textContent =
        mission.clue;

    taskText.textContent =
        mission.task;

    answerInput.value =
        "";

    answerMessage.className =
        "message";

    answerMessage.textContent =
        "";

    if (gameStatus) {

        gameStatus.textContent =
            "Ihr könnt eure Lösung eingeben.";

    }

    answerButton.disabled =
        false;

    showScreen(
        missionScreen
    );

}


/* =========================================
   ANTWORT PRÜFEN
   ========================================= */

if (answerButton) {

    answerButton.addEventListener(
        "click",
        checkAnswer
    );

}


if (answerInput) {

    answerInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {
                checkAnswer();
            }

        }
    );

}


function normalizeAnswer(value) {

    return String(value)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

}


function checkAnswer() {

    const answer =
        answerInput.value.trim();

    if (!answer) {

        answerMessage.className =
            "message error";

        answerMessage.textContent =
            "🔎 Bitte gebt eine Lösung ein.";

        return;
    }

    const mission =
        missions[currentMission];

    const correctAnswer =
        normalizeAnswer(
            mission.answer
        );

    const playerAnswer =
        normalizeAnswer(
            answer
        );


    if (
        playerAnswer === correctAnswer
    ) {

        answerMessage.className =
            "message success";

        answerMessage.textContent =
            "✅ Richtig!";

        answerButton.disabled =
            true;

        localStorage.setItem(
            "detektivAnswer",
            answer
        );

        localStorage.setItem(
            "detektivAnswerCorrect",
            "true"
        );

        localStorage.setItem(
            "detektivAnswerTime",
            new Date().toISOString()
        );

        if (gameStatus) {

            gameStatus.textContent =
                "✅ Lösung richtig. Der Spielleiter wurde informiert.";

        }

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
   WARTESCHIRM
   ========================================= */

function showWaitingScreen() {

    showScreen(
        waitingScreen
    );

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

    localStorage.removeItem(
        "detektivAnswer"
    );

    localStorage.removeItem(
        "detektivAnswerCorrect"
    );

    if (
        currentMission >= missions.length
    ) {

        finishGame();

        return;
    }

    showMission();

}


/* =========================================
   SPIEL BEENDEN
   ========================================= */

function finishGame() {

    localStorage.setItem(
        "detektivFinished",
        "true"
    );

    showScreen(
        finishScreen
    );

}


/* =========================================
   SPIELSTAND LADEN
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

        teamName =
            savedTeam;

        teamNameDisplay.textContent =
            teamName;

        teamInput.value =
            teamName;

    }


    if (
        savedMission !== null
    ) {

        currentMission =
            parseInt(
                savedMission,
                10
            );

    }


    if (
        finished === "true"
    ) {

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
