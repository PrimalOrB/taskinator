var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector('#tasks-to-do');
var tasksInProgressEl = document.querySelector('#tasks-in-progress');
var tasksCompletedEl = document.querySelector('#tasks-completed');
var taskIdCounter = 0
var pageContentEl = document.querySelector('#page-content')
var tasks = [];

loadTasks()

var taskFormHandler = function(event) {
    event.preventDefault()
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if ( !taskNameInput || !taskTypeInput ) {
        alert("You need to fill out the task form!")
        return false
    }
    formEl.reset();

    // check if form response is an edit
    var isEdit = formEl.hasAttribute('data-task-id');

    // if has attribute, get data and call function to edit process
    if (isEdit) {
        var taskId = formEl.getAttribute('data-task-id');
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } else {

    // package data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do",
    }

    // send object as an argument to createTaskEl
    createTaskEl( taskDataObj )
}
}

function createTaskEl( taskDataObj ) {

    console.log(taskDataObj)
    // create list item
    var listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter)

    // create div to hold task into and add to list item
    var taskInfoEl = document.createElement('div');
    // give it a class name
    taskInfoEl.className = 'task-info';
    // add HTMl content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    listItemEl.appendChild(taskInfoEl)

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj)

    var taskActionsEl = createTaskAction(taskIdCounter)
  
    listItemEl.appendChild(taskActionsEl)

    switch (taskDataObj.status) {
        case 'to do':
        tasksToDoEl.appendChild( listItemEl ) 
        listItemEl.querySelector("select[name='status-change']").selectedIndex = 0
        break
        case 'in progress':
        tasksInProgressEl.appendChild( listItemEl ) 
        listItemEl.querySelector("select[name='status-change']").selectedIndex = 1
        break
        case 'completed':
        tasksCompletedEl.appendChild( listItemEl )
        listItemEl.querySelector("select[name='status-change']").selectedIndex = 2
        break
    }


    // increase task counter for next unique ID
    taskIdCounter++

    saveTasks();
};

function createTaskAction ( taskId ) {
    var actionContainerEl = document.createElement('div');
    actionContainerEl.className = 'task-actions';

    // create edit button
    var editButtonEl = document.createElement('button');
    editButtonEl.textContent = 'Edit';
    editButtonEl.className = 'btn edit-btn';
    editButtonEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement('button');
    deleteButtonEl.textContent = 'Delete';
    deleteButtonEl.className = 'btn delete-btn';
    deleteButtonEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    // select element
    var selectButtonEl = document.createElement('select');
    selectButtonEl.className = 'select-status';
    selectButtonEl.setAttribute('name', 'status-change');
    selectButtonEl.setAttribute('data-task-id', taskId);

    var statusChoices = [ 'To Do', 'In Progress', 'Completed' ];

    for ( var i = 0; i < statusChoices.length; i++ ) {
        // creation option el
        var statusOptionEl = document.createElement('option');
        statusOptionEl.textContent = statusChoices[i]
        statusOptionEl.setAttribute('value', statusChoices[i] )

        selectButtonEl.appendChild(statusOptionEl)
    }


    actionContainerEl.appendChild(selectButtonEl);

    return actionContainerEl;

};

formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function(event) {
    var targetEl = event.target

    // edit clicked
    if ( targetEl.matches('.edit-btn') ) {
        var taskId = targetEl.getAttribute('data-task-id');
        editTask(taskId);
    }

    //  delete clicked
    if ( targetEl.matches('.delete-btn') ) {
        var taskId = targetEl.getAttribute('data-task-id');
        deleteTask(taskId);
    }
};

var editTask = function(taskId) {
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")

    // content from task name and type
    var taskName = taskSelected.querySelector('h3.task-name').textContent;
    var taskType = taskSelected.querySelector('span.task-type').textContent;

    // loop through tasks array and task objext with new content
    for (var i = 0; i < tasks.length; i++ ) {
        if ( tasks[i].id === parseInt(taskId) ) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    document.querySelector("#save-task").textContent = 'Save Task';
    formEl.setAttribute('data-task-id', taskId)

    saveTasks()
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    taskSelected.remove()

    var updatedTaskArr = [];

    // loop through current tasks
    for ( var i = 0; i < tasks.length; i++ ) {
        // if tasks[i].id doesn't match the value of taskId, let's keep that task
        if ( tasks[i].id !== parseInt(taskId) ) {
            updatedTaskArr.push(tasks[i])
        }
    }

    //reassign tasks array to be the same as updateTaskArr
    tasks = updatedTaskArr;

    saveTasks()
};

var completeEditTask = function(taskName, taskType, taskId) {
    //find matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector('h3.task-name').textContent = taskName;
    taskSelected.querySelector('span.task-type').textContent = taskType;

    //reset form
    formEl.removeAttribute('data-task-id');
    document.querySelector("#save-task").textContent = 'Add Task';
};

var taskStatusChangeHandler = function(event) {
    // get the task item id
    var taskId = event.target.getAttribute('data-task-id');

    // stop toLowerCase error on null
    if( event.target.value ) {
        // get currentl selected options value and convert it to lowercase
    var statusValue = event.target.value.toLowerCase();
    }

    // find the parent task item eleemtn based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === 'to do') {
        tasksToDoEl.appendChild(taskSelected)
    } else if (statusValue === 'in progress') {
        tasksInProgressEl.appendChild(taskSelected)
    } else if (statusValue === 'completed') {
        tasksCompletedEl.appendChild(taskSelected)
    }

    // update task's in tasks array
    for (var i = 0; i <tasks.length; i++ ) {
        if ( tasks[i].id === parseInt(taskId) ) {
            tasks[i].status = statusValue
        }
    }
    saveTasks()
};


function saveTasks() {
localStorage.setItem("tasks", JSON.stringify(tasks))
};

function loadTasks() {
    // get items
    savedTasks = localStorage.getItem("tasks")
    if ( !savedTasks ) {
        return false
    }

    // convert string to array
    savedTasks = JSON.parse(savedTasks)

    for ( var i = 0; i < savedTasks.length; i++ ) {
        createTaskEl( savedTasks[i] )
    }
    
}



pageContentEl.addEventListener("click", taskButtonHandler )
pageContentEl.addEventListener("click", taskStatusChangeHandler )