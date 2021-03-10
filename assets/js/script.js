var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector('#tasks-to-do');
var taskIdCounter = 0

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

    // package data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    }

    // send object as an argument to createTaskEl
    createTaskEl( taskDataObj )
}

var createTaskEl = function( taskDataObj ) {
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

    var taskActionsEl = createTaskAction(taskIdCounter)
  
    listItemEl.appendChild(taskActionsEl)

    tasksToDoEl.appendChild( listItemEl ) 

    // increase task counter for next unique ID
    taskIdCounter++
};

var createTaskAction = function( taskId ) {
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