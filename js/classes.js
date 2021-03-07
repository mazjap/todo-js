let store = window.localStorage;

class Task {
    constructor(title, dueDate, description = "No description", isCompleted = false, id = generateUUID()) {
        this.title = title;
        this.description = description;
        this.isCompleted = isCompleted;
        this.id = id;
        this.dueDate = dueDate
    }
}

class List {
    constructor(name, tasks = [], id = generateUUID()) {
        this.name = name
        this.tasks = tasks;
        this.id = id;
    }
}

class User {
    constructor(username, password) {
        this.username = username;
        this.id = this.hash(username, password);
        this.lists = this.fetchLists();
        console.log("Logged in with hash: " + this.id);
    }

    removeList(id) {
        let ret;
        for (let i=0; i<this.lists.length; i++) {
            if (this.lists[i].id == id) {
                ret = this.lists[i];
                this.lists.splice(i, 1);
                User.saveChanges();
            }
        }

        return ret;
    }

    addList(list) {
        this.lists.push(list);
        User.saveChanges();
    }

    fetchLists() {
        return JSON.parse(store.getItem(this.id) ?? '[]');
    }

    hash(username, password) {
        // Imported hashing algo
        return hex_sha512(username + password)
    }

    static current = null; //new User("jordan", "password");

    static saveChanges() {
        store.setItem(User.current.id, JSON.stringify(User.current.lists));
    }
}

class HTMLGenerator {
    static generateListItem(item, listId) {
        return `
        <div class="list-item">
            <div class="checkbox-container">
                <input type="checkbox" class="is-complete" id="${item.id}-checkbox" onchange="toggleItem('${item.id}', '${listId}')" ${item.isCompleted ? "checked" : ""}>
                <div class="text">
                    <h3 onclick="displayModal('edit-task', '${item.id}', '${listId}')">${item.title}</h3>
                    <p onclick="displayModal('edit-task', '${item.id}', '${listId}')">${item.description}</p>
                </div>
            </div>
            <div class="actions-container">
                <span class="dueDate" onclick="displayModal('edit-task', '${item.id}', '${listId}')">${item.dueDate}</span>
                <input type="checkbox" class="is-expanded">
                <button class="delete-button" onclick="deleteTask('${item.id}', '${listId}')">-</button>
            </div>
        </div>`;
    }

    static generateList(list) {
        let str = `<div id="list"><p id="new-task" onclick="displayModal(this.id, '${list.id}')">+</p>`;

        if (list.tasks.length !== 0) {
            for (let item of list.tasks) {
                str += this.generateListItem(item, list.id);
            }

            str += `<button onclick="clearCompleted('${list.id}')">Clear Completed</button>`;
        } else {
            str += "<p class='error-message'>No tasks. Press the \`+\` to make a new one.</p>";
        }

        return str + "</div>";
    }

    static generateListPreview(list) {
        return `
        <div class="list-preview" onclick="listState('${list?.id ?? 0}')">
            <h3 class="text">${list?.name ?? "No Name"}</h3>

            <div class="count">
                <p>Count:</p>
                <p class="todo-count">${list?.tasks?.length ?? 0}</p>
            </div>

            <button class="delete-button" onclick="deleteList('${list.id}')">-</button>
        </div>`;
    }

    static generateMyLists() {
        const user = User.current

        let html =  user ? `<p id="new-list" onclick="displayModal(this.id)">+</p>` : '';

        if (!user) {
            html += "<p class='error-message'>You must be signed in!</p>"
        } else if ((user?.lists ?? []).length === 0) {
            html += "<p class='error-message'>You do not have any lists</p>";
        } else {
            for (let list of user?.lists ?? []) {
                html += this.generateListPreview(list);
            }
        }

        return html
    }

    static generateDropDown(lists) {
        let html = "";
        let addNew = true;

        if (lists && lists.length != 0) {
            for (let list of lists) {
                html += `
                <span class="highlightable" onclick="listState('${list.id}')">${list.name}</span>`;
            }
        } else if (User.current) {
            html = "<span class='highlightable' onclick='myListsState()'>No lists. Click below to add a new list</span>";
        } else {
            html = "<span class='highlightable' onclick='loginState()'>You must be signed in to view lists</span>";
            addNew = false;
        }

        if (addNew) {
            html += `<span class="highlightable" onclick="displayModal('new-list')">New List</span>`;
        }

        return html;
    }

    static generateHome() {
        return `
        <div id="home">
            <h2>Welcome to Todo</h2>
            <p>click a tab to continue</p>
        </div>`;
    }

    static generateLogin() {
        return `
        <div id="login">
            <h2>Login</h2>
            <div id="username">
                <p>Username:</p>
                <input type="text" placeholder="username" id="username-input">
            </div>
            <div class="password">
                <p>Password:</p>
                <input type="text" placeholder="password" id="password-input">
            </div>
            <button id="submit-login" onclick="login()">Login</button>
        </div>`;
    }

    static generateModal(state, id, listId) {
        switch (state) {
            case "new-list":
                return `
                <input id="new-list-title" type="text" placeholder="List Title">'
                <div id="modal-buttons">
                    <button onclick="createList()">Create</button>
                    <button class="destructive" onclick="abortModal()">Cancel</button>
                </div>`;
            case "new-task":
                return `
                <input id="new-task-name" type="text" placeholder="Task Name">'
                <input id="new-task-desc" type="text" placeholder="Task Description">'
                <input id="new-task-due-date" type="date">'
                <div id="modal-buttons">
                    <button onclick="createTask('${id}')">Create</button>
                    <button class="destructive" onclick="abortModal()">Cancel</button>
                </div>`;
            case "edit-task":
                let task;
                console.log(listId);
                console.log(id);
                for (let i=0; i<User.current.lists.length; i++) {
                    let shouldBreak = false;
                    const list = User.current.lists[i];
                    if (list.id == listId) {
                        for (let j=0; j<list.tasks.length; j++) {
                            const tempTask = list.tasks[j];
                            if (tempTask.id == id) {
                                task = tempTask;
                                shouldBreak = true;
                                break;
                            }
                        }
                    }

                    if (shouldBreak) {
                        break;
                    }
                }

                if (!task) {
                    return false;
                }

                return `
                <input id="new-task-name" type="text" value="${task.title}" placeholder="Task Name">'
                <input id="new-task-desc" type="text" value="${task.description}" placeholder="Task Description">'
                <input id="new-task-due-date" type="date" value="${task.dueDate}">'
                <div id="modal-buttons">
                    <button onclick="saveTask('${id}', '${listId}')">Save</button>
                    <button class="destructive" onclick="abortModal()">Cancel</button>
                </div>`;
        }
    }
}

const State = Object.freeze({
    "home" : 1,
    "myLists" : 2,
    "listDetail" : 3,
    "login" : 4,
});