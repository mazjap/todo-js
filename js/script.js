
// Application Start
var localStorage = window.localStorage;

if (User.current) {
    refreshContent(State.myLists);
} else {
    refreshContent(State.login);
}

// Functions

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
        refreshContent(State.myLists)
    }
}

function toggleDropDown(condition) {
    const dropDown = document.getElementById("drop-down");
    const icon = document.getElementById("drop-down-icon");
    const bool = condition ?? dropDown.offsetHeight === 0;

    dropDown.innerHTML = HTMLGenerator.generateDropDown(User.current?.lists ?? []);

    if (bool) {
        dropDown.style.height = "90vh";
        dropDown.style.overflow = "visible";
        icon.style.transform = "rotate(90deg)";
    } else {
        dropDown.style.height = "0";
        dropDown.style.overflow = "hidden";
        icon.style.transform = "";
    }
}

function toggleItem(id, listId) {
    let list = User.current.removeList(listId);

    if (list) {
        for (let i=0; i<list.tasks.length; i++) {
            if (list.tasks[i].id == id) {
                list.tasks[i].isCompleted = document.getElementById(id + "-checkbox").checked;
            }
        }

        User.current.addList(list);
    }
}

function refreshContent(state, listId) {
    let html = "";
    let errorMessage = "";

    document.getElementById("login-button").innerText = User.current?.username ?? "Login";

    switch (state) {
        case State.home:
            console.log("Generating home");
            html = HTMLGenerator.generateHome();
            break;
        case State.listDetail:
            console.log("Generating single list");
            if (User.current) {
                for (let list of User.current.lists) {
                    if (list.id == listId) {
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

function displayModal(state, id, listId) {
    let result = HTMLGenerator.generateModal(state, id, listId);
    if (result) {
        document.getElementById("modal-content").innerHTML = result;
        document.getElementById("modal-popover").style.display = "flex";
    }
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

function createTask(id) {
    const name = document.getElementById("new-task-name").value;
    const desc = document.getElementById("new-task-desc").value;
    const dueDate = document.getElementById("new-task-due-date").value;
    console.log("Creating new task:");
    console.log("name: " + name);
    console.log("desc: " + desc);
    console.log("dueDate: " + dueDate);

    let list = User.current.removeList(id);
    
    if (list) {
        list.tasks.push(new Task(name, dueDate, desc))
        User.current.addList(list);
        abortModal();
        refreshContent(State.listDetail, id);
    }
}

function saveTask(id, listId) {
    const name = document.getElementById("new-task-name").value;
    const desc = document.getElementById("new-task-desc").value;
    const dueDate = document.getElementById("new-task-due-date").value;
    console.log("Saving task:");
    console.log("name: " + name);
    console.log("desc: " + desc);
    console.log("dueDate: " + dueDate);

    let list = User.current.removeList(listId);

    if (list) {
        for (let i=0; i<list.tasks.length; i++) {
            const task = list.tasks[i]
            if (task.id == id) {
                task.title = name
                task.description = desc
                task.dueDate = dueDate
            }
        }

        User.current.addList(list);
        abortModal();
        refreshContent(State.listDetail, list.id);
    }
}

function clearCompleted(id) {
    let list = User.current.removeList(id);

    if (list) {
        let arr = [];

        for (let i=0; i<list.tasks.length; i++) {
            if (!list.tasks[i].isCompleted) {
                arr.push(list.tasks[i]);
            }
        }
        list.tasks = arr;
        User.current.addList(list);
        refreshContent(State.listDetail, id);
    }
}

function deleteTask(id, listId) {
    let list = User.current.removeList(listId);

    if (list) {
        for (let i=0; i<list.tasks.length; i++) {
            const task = list.tasks[i];
            if (task.id == id) {
                list.tasks.splice(i, 1);
            }
        }

        User.current.addList(list);
        refreshContent(State.listDetail, listId);
    }
}

function deleteList(id) {
    User.current.removeList(id);
    refreshContent(State.myLists);
}

function myListsState() {
    refreshContent(State.myLists);
}

function listState(id) {
    refreshContent(State.listDetail, id);
}

function homeState() {
    refreshContent(State.home);
}

function loginState() {
    refreshContent(State.login);
}