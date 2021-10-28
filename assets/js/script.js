var buttonEl = document.querySelector("#save-task");
var tasksToDoEl = document.querySelector("#tasks-to-do");
function createTaskHandler(){
    var task = window.prompt("add a task");
    var taskItemEl =document.createElement("li");
    taskItemEl.className="task-item";
    taskItemEl.textContent = task;
    tasksToDoEl.appendChild(taskItemEl);
}

buttonEl.addEventListener("click",createTaskHandler);
