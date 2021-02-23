
// Classes

class Task {
    constructor(title, dueDate, description = "No description", isCompleted = false, id = generateID()) {
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
               this.dueDate.getMinutes();  // Output: `2021/02/23 9:49`
    }
}

class List {
    constructor(name, tasks, id = generateID()) {
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
    constructor(lists = [], id = generateID()) {
        this.lists = lists
        this.id = id
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
}

class HTMLGenerator {
    static generateListItem(item) {
        return `
        <div class="list-item">
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
        for (item of list) {
            str += generateListItem(item)
        }

        return str + "</div>"
    }
}

// Global variables

let localStorage = window.localStorage;

let lists = fetchLists();

// Functions

function generateID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
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

function save(list, key) {
    localStorage.setItem("list_keys", obj.keys);
    localStorage.setItem(key, list);
}

function changeState(state) {
    state = state;
    refreshContent();
}

function myListState() {
    let content = document.getElementById("content");
    
    content.innerHTML = "<h2>Lists</h2>";
}

function listState(list) {
    let content = document.getElementById("content");

    content.innerHTML = generateList(list);
}

function homeState() {
    let content = document.getElementById("content");
    content.innerHTML = "<h2>ACCOMPLISH EVERY GOAL</h2>";
}