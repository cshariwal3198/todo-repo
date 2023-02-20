import {TodoItem} from "../utils/todo-item.js"

const todoApiURL = "https://mk-todo-web-api.azurewebsites.net/api/ChethanTodoItems"
const deleteApiURL = "https://mk-todo-web-api.azurewebsites.net/ChethanTodoItems/deleteAll"

//this is test comment, without thid code the application will  break in the prodcution

const optionHeader = {
    "Content-type": "application/json",
}

function OptionObject(method,body,header){
    return {
        method : method,
        body : JSON.stringify(body),
        headers: header,
    }
}

export function cloudStore(){
    return {

        getTodoCloud: async function(){
            return (await fetch(todoApiURL)).json()
        },

        postMethod : async function(value){
            return (await setTodoCloud(todoApiURL,new OptionObject("POST",
                new TodoItem(value),optionHeader))).json()
        },

        putMethod : function (index, editedValue, isComplete = false) {
            return setTodoCloud(`${todoApiURL}/${index}`,
                new OptionObject("PUT",new TodoItem(editedValue,isComplete,index),optionHeader))
        },
        
        deleteMethodCloud : async function (index) {
            return await setTodoCloud(`${todoApiURL}/${index}`, new OptionObject("DELETE"))
        },

        deleteAllCloud : async function () {
            return await setTodoCloud(deleteApiURL,new OptionObject("DELETE"))
        },
    }
}

async function setTodoCloud (apiURL, options) {
    try {
        return await fetch(apiURL, options)
    } catch (error) {
        console.log("Something went wrong...!!")
    }
}
