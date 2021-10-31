var pageContentEl = document.querySelector("#page-content");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var formEl = document.querySelector("#task-form")
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var taskIdCounter = 0;
var tasks = [];

var completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

// set new values
taskSelected.querySelector("h3.task-name").textContent = taskName;
taskSelected.querySelector("span.task-type").textContent = taskType;

// loop through tasks array and task object with new content
for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  };
  saveTasks();
alert("Task Updated!");
formEl.removeAttribute("data-task-id");
document.querySelector("#save-task").textContent = "Add Task";
formEl.reset();
  };

function taskFormHandler(event){
    event.preventDefault();
    // // check if input values are empty strings
   
      
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
     if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
      } 
      var isEdit = formEl.hasAttribute("data-task-id");
    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } 
    // no data attribute, so create object as normal and pass to createTaskEl function
    else {
        var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status:"to do"
        };
        formEl.reset();
        createTaskEl(taskDataObj);
  }
  
  

  
    
}
var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    
    actionContainerEl.appendChild(editButtonEl);

    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    
    actionContainerEl.appendChild(deleteButtonEl);    
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
      
        // append to select
        statusSelectEl.appendChild(statusOptionEl);
      }
actionContainerEl.appendChild(statusSelectEl);
    return actionContainerEl;
};

var editTask = function(taskId) {
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);    
    
  };

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
    if (tasks[i].id !== parseInt(taskId)) {
        updatedTaskArr.push(tasks[i]);
    }
    }

    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
    saveTasks();
  };

var createTaskEl = function(taskDataObj) {
    var listItemEl =document.createElement("li");
    listItemEl.className="task-item";
    listItemEl.setAttribute("data-task-id",taskIdCounter);
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className="task-info";
    taskInfoEl.innerHTML="<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" +taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);
    taskDataObj.id=taskIdCounter;
    var taskActionsEl = createTaskActions(taskIdCounter);
    tasks.push(taskDataObj);
    saveTasks();
    listItemEl.appendChild(taskActionsEl);
    tasksToDoEl.appendChild(listItemEl);
    taskIdCounter ++;
}

formEl.addEventListener("submit",taskFormHandler);
var taskButtonHandler = function(event) {
    // get target element from event
    var targetEl = event.target;
  
    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
      var taskId = targetEl.getAttribute("data-task-id");
      editTask(taskId);
    } 
    // delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
      var taskId = targetEl.getAttribute("data-task-id");
      deleteTask(taskId);
    }
  };
  var taskStatusChangeHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
  
    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
      } 
      else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
      } 
      else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
      }
      // update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
        tasks[i].status = statusValue;
        }
  }
  saveTasks();
};
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
var loadTasks = function(){
   var  localTasks = localStorage.getItem("tasks");
    tasks = JSON.parse(localTasks);
    if(tasks === null){
        tasks=[];
    }
   for (var i = 0; i < tasks.length; i++) {
        taskIdCounter =tasks[i].id;
        var listItemEl =document.createElement("li");
        listItemEl.className="task-item";
        listItemEl.setAttribute("data-task-id",taskIdCounter);
        var taskInfoEl = document.createElement("div");
        taskInfoEl.className="task-info";
        taskInfoEl.innerHTML="<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" +tasks[i].type + "</span>";
        listItemEl.appendChild(taskInfoEl);
        var taskActionsEl = createTaskActions(tasks[i].id);
        listItemEl.appendChild(taskActionsEl);
        if(tasks[i].status ==="to do"){
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.appendChild(listItemEl);
        }
        else if (tasks[i].status === "in progress") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
        }
        else if(tasks[i].status === "completed"){
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2; 
            tasksCompletedEl.appendChild(listItemEl);
        }
        taskIdCounter ++;
    }
    
}
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
loadTasks();