import { view } from "../view/view-todo.js";
import { TodoItem } from "../utils/todo-item.js"
import { cloudStore } from "../model/cloudstore-service.js"
import { localStore, getTodoLocal } from "../model/localstore-service.js";

const taskInput = document.querySelector(".form-input")
const divToDisplay = document.querySelector(".div-to-display")
const store = document.querySelector(".storage")
let previousSpanValue = ""

let lsGet;
localStorage.setItem("storage", localStorage.getItem("storage") || "CloudStorage")

const { postMethod, deleteMethodCloud, getTodoCloud, putMethod, deleteAllCloud } = cloudStore()
const { createTodoLocal, editTodoLocal, deleteTodoLocal, deleteAllLocal } = localStore()
const { showEmptyInputError, prepareTask } = view()

handlePageRefresh()

export function appController() {
    return {
        deleteSingleTask: function (parentElement, value) {
            actualExecutionFunction(async () => {
                const result = await deleteMethodCloud(value.id)
                result.status === 204 && divToDisplay.removeChild(parentElement)
            }, () => { deleteTodoLocal(value.name), divToDisplay.removeChild(parentElement) })
        },

        editSelectedTask: function (editButton, span, index) {
            if (editButton.innerText === "Edit") {
                previousSpanValue = span.innerText
                span.contentEditable = true
                span.focus()
                editButton.innerText = "Save"
            } else {
                editButton.innerText = "Edit"
                span.contentEditable = false
                actualExecutionFunction(() => { putMethod(index, span.innerText) },
                    () => { editTodoLocal(previousSpanValue, span.innerText) })
            }
        },

        varifyCheck: async function (check, value) {
            if (check.checked === true) {
                actualExecutionFunction(() => { putMethod(value.id, value.name, true) },
                    () => { editTodoLocal(value.name, value.name, true) })
                check.parentElement.style.textDecoration = "line-through"
            } else {
                actualExecutionFunction(() => { putMethod(value.id, value.name, false) },
                    () => { editTodoLocal(value.name, value.name, false) })
                check.parentElement.style.textDecoration = "none"
            }
        }
    }
}

function setTaskToList(event) {
    event.preventDefault()
    const inputValue = taskInput.value;
    showEmptyInputError() && actualExecutionFunction(async () => {
        const postResult = await postMethod(inputValue)
        postResult && prepareTask(postResult)
    }, () => { createTodoLocal(inputValue), prepareTask(new TodoItem(inputValue)) })
}

async function handlePageRefresh() {
    lsGet = localStorage.getItem("storage");
    let tasks = (lsGet === "CloudStorage") ? await getTodoCloud() : getTodoLocal()
    tasks.map((task) => prepareTask(task))
    store.innerText = lsGet
}

function switchBetweenStorage() {
    if (confirm(`You are switching your default Storage. Press Ok to proceed`)) {
        actualExecutionFunction(() => { localStorage.setItem("storage", "LocalStorage") },
            () => { localStorage.setItem("storage", "CloudStorage") })

        divToDisplay.innerHTML = ""
        handlePageRefresh()
        store.innerText = lsGet
    }
}

async function clearAllTasks() {
    confirm("Your all tasks will be erased, Continue ?") &&
        actualExecutionFunction(async () => {
            let deleteResponse = await deleteAllCloud()
            deleteResponse.status === 200 && (divToDisplay.innerHTML = "")
        },
            () => { deleteAllLocal(), divToDisplay.innerHTML = "" })
}

function actualExecutionFunction(callback1, callback2) {
    localStorage.getItem("storage") === "CloudStorage" ? callback1() : callback2()
}

document.querySelector("form").addEventListener("submit", setTaskToList)
store.addEventListener("click", switchBetweenStorage)
document.querySelector(".all-clear").addEventListener("click", clearAllTasks)