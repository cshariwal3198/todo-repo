import { TodoItem } from "../utils/todo-item.js"

let { getTodoLocal, setTodoLocal } = localStore()

export function localStore() {
    return {
        getTodoLocal : function () {
            return JSON.parse(localStorage.getItem("todo") || '[]')
        },

        setTodoLocal : function (taskValue) {
            localStorage.setItem("todo", JSON.stringify(taskValue))
        },

        createTodoLocal : function (value) {
            const existingList = getTodoLocal()
            existingList.push(new TodoItem(value))
            setTodoLocal(existingList)
        },

        editTodoLocal : function (previousValue, newValue, isComplete = false) {
            const existingList = getTodoLocal()
            existingList.splice(existingList.indexOf(returnRequireObject(previousValue,existingList)), 1, new TodoItem(newValue,isComplete))
            setTodoLocal(existingList)
        },

        deleteTodoLocal : function (value) {
            const existingList = getTodoLocal()
            existingList.splice(existingList.indexOf(returnRequireObject(value,existingList)), 1)
            setTodoLocal(existingList)
        },

        deleteAllLocal : function () {
            setTodoLocal([])
        }

    }
}

function returnRequireObject(value,existingList){
    for(let elem of existingList){
        if(elem.name === value){
            return elem
        }
    }
}