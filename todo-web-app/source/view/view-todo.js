import { appController } from "../controller/app-controller.js"

let { deleteSingleTask, editSelectedTask, varifyCheck } = appController()

const divToDisplay = document.querySelector(".div-to-display")
const taskInput = document.querySelector(".form-input")
const inputError = document.getElementById("error-div")


export function view() {
    return {

        prepareTask: function (value) {
            let paraBlock = createNewElement("p")
            let span = createNewElement("span", value.name)
            appendToParent(paraBlock, span)
            appendToParent(paraBlock, createCheckBox("change", value, span))
            appendToParent(paraBlock, getEditButton("click", span, value))
            appendToParent(paraBlock, getDeleteButton("click", value))
            appendToParent(divToDisplay, paraBlock)
            taskInput.value = ""
        },

        showEmptyInputError: function () {
            if (!taskInput.value) {
                inputError.innerHTML = "** please enter a task"
                return false
            } else {
                inputError.innerHTML = ""
                return true
            }
        }

    }
}


function createNewElement(elementName, text) {
    let newElement = document.createElement(elementName)
    if (text) { newElement.innerText = text }
    return newElement;
}

function getDeleteButton(event, value) {
    let deleteButton = createNewElement("button", "X")
    deleteButton.addEventListener(event, () => deleteSingleTask(deleteButton.parentNode, value))
    return deleteButton
}

function getEditButton(event, span, value) {
    let editButton = createNewElement("button", "Edit")
    editButton.addEventListener(event, () => editSelectedTask(editButton, span, value.id))
    return editButton
}

function createCheckBox(event, value, span) {
    let check = createNewElement("input")
    check.type = "checkbox"
    adjustCheckValue(check, span, value)
    check.addEventListener(event, () => varifyCheck(check, value))
    return check
}

function appendToParent(parent, child) {
    parent.appendChild(child)
}

function adjustCheckValue(check, span, value) {
    if (value.isCompleted) {
        check.checked = true
        span.style.textDecoration = "line-through"
    } else {
        check.checked = false
        span.style.textDecoration = "none"
    }
}