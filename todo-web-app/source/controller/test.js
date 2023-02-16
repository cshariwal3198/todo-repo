import { cloudStore } from "../model/cloudstore-service";
import { localStore } from "../model/localstore-service";
import { view } from "../view/view-todo";

export function undoDeletedTasks(){
    let option = confirm("You can undo deleted tasks. Press Ok to undo.")
    if(option){
        let tasks = localStorage.getItem("todo") === "CloudStorage" ? cloudStore().getTodoCloud : localStore().getTodoLocal
        tasks.map((task)=>{
            view().prepareTask(task)
        })
    }
}