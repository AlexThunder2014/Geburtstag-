// ============================================
// DETEKTIV-JAGD
// ADMIN-ZENTRALE
// ============================================

const ADMIN_PIN = "1234";

let database = null;

let allGroups = {};


// ============================================
// ELEMENTE
// ============================================

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


const groupsContainer =
    document.getElementById("groupsContainer");

const deleteAllGroupsButton =
    document.getElementById(
        "deleteAllGroupsButton"
    );


const newGroupName =
    document.getElementById(
        "newGroupName"
    );

const newGroupPin =
    document.getElementById(
        "newGroupPin"
    );

const createGroupButton =
    document.getElementById(
        "createGroupButton"
    );

const groupCreateMessage =
    document.getElementById(
        "groupCreateMessage"
    );


const missionTitleInput =
    document.getElementById(
        "missionTitleInput"
    );

const missionClueInput =
    document.getElementById(
        "missionClueInput"
    );

const missionTaskInput =
    document.getElementById(
        "missionTaskInput"
    );

const missionSolutionInput =
    document.getElementById(
        "missionSolutionInput"
    );

const missionGroupSelect =
    document.getElementById(
        "missionGroupSelect"
    );

const sendMissionButton =
    document.getElementById(
        "sendMissionButton"
    );

const missionSendStatus =
    document.getElementById(
        "missionSendStatus"
    );


const messageGroupSelect =
    document.getElementById(
        "messageGroupSelect"
    );

const adminMessageInput =
    document.getElementById(
        "adminMessageInput"
    );

const sendMessageButton =
    document.getElementById(
        "sendMessageButton"
    );

const messageStatus =
    document.getElementById(
        "messageStatus"
    );


const finishGroupSelect =
    document.getElementById(
        "finishGroupSelect"
    );

const finishGameButton =
    document.getElementById(
        "finishGameButton"
    );

const finishStatus =
    document.getElementById(
        "finishStatus"
    );


const logoutButton =
    document.getElementById(
        "logoutButton"
    );


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
// LOGIN
// ============================================

loginButton.addEventListener(
    "click",
    login
);


adminPassword.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            login();

        }

    }
);


function login() {

    const pin =
        adminPassword.value.trim();


    if (
        pin === ADMIN_PIN
    ) {

        sessionStorage.setItem(
            "detektivAdmin",
            "true"
        );


        loginMessage.className =
            "message success";

        loginMessage.textContent =
            "✅ Zugang erlaubt.";


        setTimeout(
            openDashboard,
            250
        );


    } else {

        loginMessage.className =
            "message error";

        loginMessage.textContent =
            "❌ Falsche Admin-PIN.";

        adminPassword.value =
            "";

        adminPassword.focus();

    }

}


// ============================================
// DASHBOARD
// ============================================

async function openDashboard() {

    adminLogin.classList.remove(
        "active"
    );

    adminDashboard.classList.add(
        "active"
    );


    const Firebase =
        await waitForFirebase();


    database =
        Firebase.database;


    listenToGroups();

}


// ============================================
// GRUPPEN LIVE LADEN
// ============================================

function listenToGroups() {

    const Firebase =
        window.DetektivDB;


    const groupsRef =
        Firebase.ref(
            database,
            "groups"
        );


    Firebase.onValue(
        groupsRef,
        snapshot => {

            allGroups =
                snapshot.val() || {};


            renderGroups();

            updateGroupSelects();

        }
    );

}


// ============================================
// GRUPPEN DARSTELLEN
// ============================================

function renderGroups() {

    const ids =
        Object.keys(allGroups);


    if (
        ids.length === 0
    ) {

        groupsContainer.innerHTML = `

            <div class="empty-state">

                👥 Noch keine Gruppen vorhanden.

            </div>

        `;

        return;

    }


    groupsContainer.innerHTML =
        "";


    ids.forEach(
        id => {

            const group =
                allGroups[id];


            if (
                group.deleted === true
            ) {

                return;

            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "group-card";


            const online =
                group.online === true;


            const answer =
                group.answer;


            const mission =
                group.currentMission;


            card.innerHTML = `

                <div class="group-card-header">

                    <div>

                        <h3>
                            👥 ${escapeHtml(
                                group.teamName ||
                                "Unbenannte Gruppe"
                            )}
                        </h3>

                        <span class="group-pin">
                            PIN: ${escapeHtml(
                                String(
                                    group.pin || ""
                                )
                            )}
                        </span>

                    </div>

                    <span class="${
                        online
                            ? "status-online"
                            : "status-offline"
                    }">

                        ${
                            online
                                ? "🟢 Online"
                                : "🔴 Offline"
                        }

                    </span>

                </div>


                <div class="group-info">

                    <div>
                        <strong>
                            Station:
                        </strong>

                        ${
                            mission
                                ? escapeHtml(
                                    String(
                                        mission.station ||
                                        "—"
                                    )
                                )
                                : "—"
                        }

                    </div>


                    <div>

                        <strong>
                            Antwort:
                        </strong>

                        ${
                            answer
                                ? escapeHtml(
                                    answer.text || "—"
                                )
                                : "Keine Antwort"
                        }

                    </div>


                    <div>

                        <strong>
                            Status:
                        </strong>

                        ${
                            group.finished
                                ? "🏆 Abgeschlossen"
                                : "🎯 Aktiv"
                        }

                    </div>

                </div>


                <div class="group-actions">

                    <button
                        class="small-button"
                        data-action="correct"
                        data-id="${id}"
                    >
                        ✅ Richtig
                    </button>


                    <button
                        class="small-button"
                        data-action="wrong"
                        data-id="${id}"
                    >
                        ❌ Falsch
                    </button>


                    <button
                        class="danger-button small"
                        data-action="delete"
                        data-id="${id}"
                    >
                        🗑️ Löschen
                    </button>

                </div>

            `;


            groupsContainer.appendChild(
                card
            );

        }
    );


    document
        .querySelectorAll(
            "[data-action]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                handleGroupAction
            );

        });

}


// ============================================
// GRUPPEN-AKTIONEN
// ============================================

async function handleGroupAction(event) {

    const button =
        event.currentTarget;

    const action =
        button.dataset.action;

    const id =
        button.dataset.id;


    if (!id) {
        return;
    }


    const Firebase =
        window.DetektivDB;


    const groupRef =
        Firebase.ref(
            database,
            "groups/" + id
        );


    if (
        action === "delete"
    ) {

        const group =
            allGroups[id];


        const confirmDelete =
            confirm(
                `Gruppe "${
                    group.teamName || ""
                }" wirklich löschen?`
            );


        if (!confirmDelete) {
            return;
        }


        await Firebase.remove(
            groupRef
        );


        return;

    }


    if (
        action === "correct"
    ) {

        await Firebase.update(
            groupRef,
            {

                "answer/correct":
                    true

            }
        );


        return;

    }


    if (
        action === "wrong"
    ) {

        await Firebase.update(
            groupRef,
            {

                "answer/correct":
                    false

            }
        );


        return;

    }

}


// ============================================
// GRUPPE ERSTELLEN
// ============================================

createGroupButton.addEventListener(
    "click",
    createGroup
);


async function createGroup() {

    const name =
        newGroupName.value.trim();

    const pin =
        newGroupPin.value.trim();


    if (!name) {

        showStatus(
            groupCreateMessage,
            "❌ Teamname fehlt.",
            "error"
        );

        return;

    }


    if (!pin) {

        showStatus(
            groupCreateMessage,
            "❌ Gruppen-PIN fehlt.",
            "error"
        );

        return;

    }


    const existing =
        Object.values(
            allGroups
        )
        .find(
            group =>
                String(group.pin) ===
                String(pin)
        );


    if (existing) {

        showStatus(
            groupCreateMessage,
            "❌ Diese PIN wird bereits verwendet.",
            "error"
        );

        return;

    }


    const Firebase =
        window.DetektivDB;


    const groupsRef =
        Firebase.ref(
            database,
            "groups"
        );


    const newRef =
        Firebase.push(
            groupsRef
        );


    await Firebase.set(
        newRef,
        {

            teamName:
                name,

            pin:
                pin,

            online:
                false,

            finished:
                false,

            createdAt:
                Date.now(),

            currentMission:
                null,

            answer:
                null,

            adminMessage:
                ""

        }
    );


    newGroupName.value =
        "";

    newGroupPin.value =
        "";


    showStatus(
        groupCreateMessage,
        "✅ Gruppe wurde erstellt.",
        "success"
    );

}


// ============================================
// AUSWAHLLISTEN AKTUALISIEREN
// ============================================

function updateGroupSelects() {

    const selects = [

        missionGroupSelect,

        messageGroupSelect,

        finishGroupSelect

    ];


    selects.forEach(
        select => {

            if (!select) {
                return;
            }


            const oldValue =
                select.value;


            select.innerHTML = `

                <option value="">
                    -- Gruppe auswählen --
                </option>

            `;


            Object.entries(
                allGroups
            )
            .forEach(
                ([id, group]) => {

                    if (
                        group.deleted === true
                    ) {

                        return;

                    }


                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        id;


                    option.textContent =
                        `${group.teamName || "Gruppe"} (PIN ${group.pin || "—"})`;


                    select.appendChild(
                        option
                    );

                }
            );


            if (
                oldValue &&
                allGroups[oldValue]
            ) {

                select.value =
                    oldValue;

            }

        }
    );

}


// ============================================
// MISSION SENDEN
// ============================================

sendMissionButton.addEventListener(
    "click",
    sendMission
);


async function sendMission() {

    const title =
        missionTitleInput.value.trim();

    const clue =
        missionClueInput.value.trim();

    const task =
        missionTaskInput.value.trim();

    const solution =
        missionSolutionInput.value.trim();

    const groupId =
        missionGroupSelect.value;


    if (!title) {

        showStatus(
            missionSendStatus,
            "❌ Titel fehlt.",
            "error"
        );

        return;

    }


    if (!clue) {

        showStatus(
            missionSendStatus,
            "❌ Hinweis fehlt.",
            "error"
        );

        return;

    }


    if (!task) {

        showStatus(
            missionSendStatus,
            "❌ Aufgabe fehlt.",
            "error"
        );

        return;

    }


    if (!solution) {

        showStatus(
            missionSendStatus,
            "❌ Lösung fehlt.",
            "error"
        );

        return;

    }


    if (!groupId) {

        showStatus(
            missionSendStatus,
            "❌ Bitte eine Gruppe auswählen.",
            "error"
        );

        return;

    }


    const group =
        allGroups[groupId];


    const nextStation =
        group.currentMission &&
        group.currentMission.station
            ? Number(
                group.currentMission.station
            ) + 1
            : 1;


    const mission = {

        active:
            true,

        title:
            title,

        clue:
            clue,

        task:
            task,

        solution:
            solution,

        station:
            nextStation,

        sentAt:
            Date.now()

    };


    const Firebase =
        window.DetektivDB;


    await Firebase.update(

        Firebase.ref(
            database,
            "groups/" + groupId
        ),

        {

            currentMission:
                mission,

            answer:
                null,

            finished:
                false

        }

    );


    showStatus(
        missionSendStatus,
        "📡 Hinweis wurde live gesendet!",
        "success"
    );


    missionTitleInput.value =
        "";

    missionClueInput.value =
        "";

    missionTaskInput.value =
        "";

    missionSolutionInput.value =
        "";

}


// ============================================
// NACHRICHT SENDEN
// ============================================

sendMessageButton.addEventListener(
    "click",
    sendAdminMessage
);


async function sendAdminMessage() {

    const groupId =
        messageGroupSelect.value;

    const message =
        adminMessageInput.value.trim();


    if (!groupId) {

        showStatus(
            messageStatus,
            "❌ Bitte eine Gruppe auswählen.",
            "error"
        );

        return;

    }


    if (!message) {

        showStatus(
            messageStatus,
            "❌ Bitte eine Nachricht eingeben.",
            "error"
        );

        return;

    }


    const Firebase =
        window.DetektivDB;


    await Firebase.update(

        Firebase.ref(
            database,
            "groups/" + groupId
        ),

        {

            adminMessage:
                message,

            adminMessageTime:
                Date.now()

        }

    );


    adminMessageInput.value =
        "";


    showStatus(
        messageStatus,
        "📢 Nachricht wurde gesendet.",
        "success"
    );

}


// ============================================
// GRUPPE ABSCHLIESSEN
// ============================================

finishGameButton.addEventListener(
    "click",
    finishGame
);


async function finishGame() {

    const groupId =
        finishGroupSelect.value;


    if (!groupId) {

        showStatus(
            finishStatus,
            "❌ Bitte eine Gruppe auswählen.",
            "error"
        );

        return;

    }


    const group =
        allGroups[groupId];


    const confirmation =
        confirm(
            `Soll "${
                group.teamName || "diese Gruppe"
            }" wirklich beendet werden?`
        );


    if (!confirmation) {
        return;
    }


    const Firebase =
        window.DetektivDB;


    await Firebase.update(

        Firebase.ref(
            database,
            "groups/" + groupId
        ),

        {

            finished:
                true,

            online:
                false

        }

    );


    showStatus(
        finishStatus,
        "🏆 Gruppe wurde abgeschlossen.",
        "success"
    );

}


// ============================================
// ALLE GRUPPEN LÖSCHEN
// ============================================

deleteAllGroupsButton.addEventListener(
    "click",
    deleteAllGroups
);


async function deleteAllGroups() {

    const ids =
        Object.keys(
            allGroups
        );


    if (
        ids.length === 0
    ) {

        alert(
            "Es gibt keine Gruppen."
        );

        return;

    }


    const confirmation =
        confirm(
            "⚠️ Wirklich ALLE Gruppen löschen?\n\nDieser Vorgang kann nicht rückgängig gemacht werden."
        );


    if (!confirmation) {
        return;
    }


    const secondConfirmation =
        prompt(
            'Zur Bestätigung "LÖSCHEN" eingeben:'
        );


    if (
        secondConfirmation !==
        "LÖSCHEN"
    ) {

        return;

    }


    const Firebase =
        window.DetektivDB;


    await Firebase.remove(

        Firebase.ref(
            database,
            "groups"
        )

    );


    alert(
        "🧹 Alle Gruppen wurden gelöscht."
    );

}


// ============================================
// AUSLOGGEN
// ============================================

logoutButton.addEventListener(
    "click",
    () => {

        sessionStorage.removeItem(
            "detektivAdmin"
        );


        window.location.href =
            "index.html";

    }
);


// ============================================
// STATUS
// ============================================

function showStatus(
    element,
    text,
    type
) {

    if (!element) {
        return;
    }


    element.className =
        "message " + type;


    element.textContent =
        text;

}


// ============================================
// HTML SICHER DARSTELLEN
// ============================================

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ============================================
// AUTOMATISCH EINLOGGEN
// ============================================

if (
    sessionStorage.getItem(
        "detektivAdmin"
    ) === "true"
) {

    openDashboard();

}
