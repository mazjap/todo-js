
// Application Start
var localStorage = window.localStorage;

refreshContent(State.login);

// Functions

function hash(username, password) {
    // Imported hashing algo
    return hex_sha512(username + password)
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function displayError(message) {
    document.getElementById("content").innerHTML += `<p class="error-message">${message}</p>`;
}

function login() {
    const usernameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");

    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username && password) {
        User.current = new User(username, password)
        document.getElementById("login-button").innerText = User.current?.username ?? "No Username";
        refreshContent(State.myLists)
    }
}

function toggleDropDown() {
    const dropDown = document.getElementById("drop-down");
    const icon = document.getElementById("drop-down-icon");
    const bool = dropDown.offsetHeight === 0;

    dropDown.innerHTML = HTMLGenerator.generateDropDown(User.current?.lists ?? []);

    if (bool) {
        dropDown.style.height = "90vw";
        dropDown.style.overflow = "visible";
        icon.style.transform = "rotate(90deg)";
    } else {
        dropDown.style.height = "0";
        dropDown.style.overflow = "hidden";
        icon.style.transform = "";
    }
}

function refreshContent(state, listId) {
    console.log(state);
    let html = "";
    let errorMessage = "";

    switch (state) {
        case State.home:
            console.log("Generating home");
            html = HTMLGenerator.generateHome();
            break;
        case State.listDetail:
            console.log("Generating single list");
            if (User.current) {
                for (let list of User.current?.lists ?? []) {
                    if (list.id === listId) {
                        html = HTMLGenerator.generateList(list);
                        break;
                    }
                }
                
                if (!html) {
                    errorMessage = "Cannot find list with id: " + listId;
                }
            }
            break;
        case State.myLists:
            console.log("Generating my lists");
            html = HTMLGenerator.generateMyLists();
            break;
        case State.login:
            console.log("Generating login");
            html = HTMLGenerator.generateLogin();
            break;
    }

    if (errorMessage) {
        displayError(errorMessage);
    } else {
        document.getElementById("content").innerHTML = html;
    }
}

function displayModal(state) {
    document.getElementById("modal-content").innerHTML = HTMLGenerator.generateModal(state);
    document.getElementById("modal-popover").style.display = "flex";
}

function abortModal() {
    document.getElementById("modal-popover").style.display = "none";
}

function createList() {
    const name = document.getElementById("new-list-title").value;

    if (User.current && name) {
        const list = new List(name);
        User.current.addList(list);
        User.saveChanges();
        document.getElementById("drop-down").innerHTML = HTMLGenerator.generateDropDown(User.current?.lists ?? []);
        abortModal();
        refreshContent(State.listDetail, list.id);
    }
}

function myListsState() {
    refreshContent(State.myLists);
}

function listState(id) {
    refreshContent(State.listDetail);
}

function homeState() {
    refreshContent(State.home);
}

function loginState() {
    refreshContent(State.login);
}