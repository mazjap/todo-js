
// Application Start
var localStorage = window.localStorage;
var user;

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

function fetchLists() {
    let obj = {};
    const keys = localStorage.getItem("list_keys") ?? [];

    for (key of keys) {
        const data = localStorage.getItem(key);
        if (data) {
            obj[key] = data;
        }
    }

    return obj;
}

function login() {
    const usernameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");

    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username && password) {

    }
}

function toggleDropDown(bool) {
    const dropDown = document.getElementById("drop-down");

    if (bool) {
        dropDown.style.display = "inline";
    } else {
        dropDown.style.display = "none";
    }
}

function save(list, key) {
    localStorage.setItem("list_keys", obj.keys);
    localStorage.setItem(key, list);
}

function fetch(key) {
    return localStorage.getItem(key)
}

function refreshContent(state) {
    console.log(state);
    let html = "";

    switch (state) {
        case State.home:
            console.log("Generating home");
            html = HTMLGenerator.generateHome();
            break;
        case State.listDetail:
            console.log("Generating single list");
            html = HTMLGenerator.generateList(new List("My List", [new Task("Do stuff", Date.now(), "Hehe")]));
            break;
        case State.myLists:
            console.log("Generating my lists");
            html = HTMLGenerator.generateMyLists([new List("My List", [new Task("Do stuff", Date.now(), "Hehe"), new Task("Do other stuff", Date.now(), "Hehe")])]);
            break;
        case State.login:
            console.log("Generating login");
            html = HTMLGenerator.generateLogin();
            break;
    }

    document.getElementById("content").innerHTML = html;
}

function myListState() {
    refreshContent(State.myLists);
}

function listState(list) {
    refreshContent(State.listDetail);
}

function homeState() {
    refreshContent(State.home);
}

function loginState() {
    refreshContent(State.login);
}