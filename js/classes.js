let store = window.localStorage;

class Task {
    constructor(title, dueDate, description = "No description", isCompleted = false, id = generateUUID()) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.isCompleted = isCompleted;
        this.id = id;
    }

    setTitle(newTitle) {
        this.title = newTitle;
    }

    setDesc(newDesc) {
        this.description = newDesc;
    }

    setDueDate(newDate) {
        this.dueDate = newDate;
    }

    toggleCompleted() {
        this.isCompleted = !this.isCompleted;
    }

    formattedDate() {
        return this.dueDate.getFullYear() + "/" +
               this.dueDate.getMonth() + "/" +
               this.dueDate.getDate() + " " +
               this.dueDate.getHours() + ":"  +
               this.dueDate.getMinutes(); // Output: `2021/02/23 9:49`
    }
}

class List {
    constructor(name, tasks, id = generateUUID()) {
        this.name = name
        this.tasks = tasks;
        this.id = id;
    }

    push(task) {
        this.tasks.push(task);
    }

    removeTask(id) {
        for (let i=0; i<this.tasks; i++) {
            if (this.tasks[i].id == id) {
                this.tasks.splice(i, 1);
            }
        }
    }

    clearCompletedTodos() {
        for (todo of this.tasks) {
            if (todo.isCompleted) {
                this.removeTask(todo.id);
            }
        }
    }
}

class User {
    constructor(username, password) {
        this.username = username;
        this.id = hash(username, password).toString();
        this.lists = this.fetchLists();
        console.log("Logged in with hash: " + this.id);
    }

    removeList(id) {
        for (let i=0; i<this.lists; i++) {
            if (this.lists[i].id == id) {
                this.lists.splice(i, 1);
            }
        }
    }

    addList(list) {
        this.lists.push(list)
    }


    fetchLists() {
        let val = store.getItem(this.id)
        console.log("Val: " + val);
        return JSON.parse(val ?? '[]');
    }

    static current = null;

    static saveChanges() {
        let stringcheese = JSON.stringify(this.lists);
        console.log(stringcheese);
        store.setItem(this.id, stringcheese);
    }
}

class HTMLGenerator {
    static generateListItem(item) {
        return `
        <div id="list-item">
            <div class="checkbox-container">
                <input type="checkbox" class="is-complete">
                <div class="text">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                </div>
            </div>
            <div class="actions-container">
                <span class="dueDate">${item.formattedDate}</span>
                <img src="" alt="">
                <input type="checkbox" class="is-expanded">
                <button onclick="">-</button>
            </div>
        </div>`;
    }

    static generateList(list) {
        let str = '<div id="list">'
        for (let item of list?.tasks ?? []) {
            str += this.generateListItem(item)
        }

        return str + "</div>"
    }

    static generateListPreview(list) {
        return `
        <div class="list-preview">
            <h3 class="text">${list.name}</h3>

            <div class="count">
                <p>Count:</p>
                <p class="todo-count">${list?.tasks?.length ?? 0}</p>
            </div>
        </div>`;
    }

    static generateMyLists() {
        const user = User.current

        let html =  user ? `<p id="new-list" onclick="displayModal('new-list')">+</p>` : '';

        if ((user?.lists ?? []).length !== 0) {
            for (let list of user?.lists ?? []) {
                html += this.generateListPreview(list);
            }
        } else {
            html += "<p class='error-message'>You do not have any lists</p>";
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

    static generateModal(state) {
        switch (state) {
            case "new-list":
                return `<input id="new-list-title" type="text" placeholder="List Title">'
                <div id="modal-buttons">
                    <button onclick="createList()">Create</button>
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