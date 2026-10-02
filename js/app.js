const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");
const loadSamplesBtn = document.querySelector("#loadSamplesBtn");
const taskList = document.querySelector("#taskList");
const taskMessage = document.querySelector("#taskMessage");

const totalCount = document.querySelector("#totalCount");
const pendingCount = document.querySelector("#pendingCount");
const completedCount = document.querySelector("#completedCount");

let nextTaskId = 1;


/*
    createTaskElement(taskText, taskId)

    Creates one task-item element.

    IMPORTANT:
    This function creates the element but does NOT
    append it to #taskList.
*/
function createTaskElement(taskText, taskId) {

    const taskItem = document.createElement("li");

    taskItem.classList.add("task-item");

    taskItem.dataset.taskId = taskId;
    taskItem.dataset.state = "pending";


    // Task text
    const taskTextSpan = document.createElement("span");

    taskTextSpan.classList.add("task-text");

    // SAFE DOM API
    taskTextSpan.textContent = taskText;


    // Complete button
    const completeBtn = document.createElement("button");

    completeBtn.type = "button";
    completeBtn.classList.add("complete-btn");
    completeBtn.textContent = "Complete";


    // Edit button
    const editBtn = document.createElement("button");

    editBtn.type = "button";
    editBtn.classList.add("edit-btn");
    editBtn.textContent = "Edit";


    // Remove button
    const removeBtn = document.createElement("button");

    removeBtn.type = "button";
    removeBtn.classList.add("remove-btn");
    removeBtn.textContent = "Remove";


    // Add children to task item
    taskItem.appendChild(taskTextSpan);
    taskItem.appendChild(completeBtn);
    taskItem.appendChild(editBtn);
    taskItem.appendChild(removeBtn);


    return taskItem;
}


/*
    addTask(taskText)

    Validates and adds a new task.
*/
function addTask(taskText) {

    const trimmedText = taskText.trim();


    // Validate empty task
    if (trimmedText === "") {

        taskMessage.textContent = "Task cannot be empty";

        taskMessage.classList.add("error");

        taskInput.focus();

        return;
    }


    // Create unique ID
    const taskId = `task-${nextTaskId}`;

    nextTaskId += 1;


    // Create task
    const taskItem = createTaskElement(
        trimmedText,
        taskId
    );


    // Add task to live DOM
    taskList.appendChild(taskItem);


    // Clear input
    taskInput.value = "";


    // Clear validation message
    taskMessage.textContent = "";

    taskMessage.classList.remove("error");


    // Update counts
    updateTaskCounts();


    taskInput.focus();
}


/*
    toggleTaskComplete(taskItem)

    Toggles completed/pending state.
*/
function toggleTaskComplete(taskItem) {

    taskItem.classList.toggle("completed");


    if (taskItem.classList.contains("completed")) {

        taskItem.dataset.state = "completed";

    } else {

        taskItem.dataset.state = "pending";
    }


    updateTaskCounts();
}


/*
    beginTaskEdit(taskItem)

    Replaces the visible task text
    with an edit input.
*/
function beginTaskEdit(taskItem) {

    const taskTextSpan =
        taskItem.querySelector(".task-text");

    const editButton =
        taskItem.querySelector(".edit-btn");


    if (!taskTextSpan || !editButton) {
        return;
    }


    // Create edit input
    const editInput = document.createElement("input");

    editInput.type = "text";

    editInput.classList.add("edit-input");

    editInput.value = taskTextSpan.textContent;


    // Replace task text with input
    taskTextSpan.replaceWith(editInput);


    // Change Edit to Save
    editButton.textContent = "Save";


    editInput.focus();

    editInput.select();
}


/*
    saveTaskEdit(taskItem)

    Saves edited task text safely.
*/
function saveTaskEdit(taskItem) {

    const editInput =
        taskItem.querySelector(".edit-input");

    const editButton =
        taskItem.querySelector(".edit-btn");


    if (!editInput || !editButton) {
        return;
    }


    const trimmedText = editInput.value.trim();


    // Validate empty edit
    if (trimmedText === "") {

        taskMessage.textContent = "Task cannot be empty";

        taskMessage.classList.add("error");

        editInput.focus();

        return;
    }


    // Create new task text span
    const taskTextSpan = document.createElement("span");

    taskTextSpan.classList.add("task-text");


    // SAFE DOM API
    taskTextSpan.textContent = trimmedText;


    // Replace input with text
    editInput.replaceWith(taskTextSpan);


    // Change Save back to Edit
    editButton.textContent = "Edit";


    // Clear message
    taskMessage.textContent = "";

    taskMessage.classList.remove("error");
}


/*
    removeTask(taskItem)

    Removes only the selected task.
*/
function removeTask(taskItem) {

    taskItem.remove();

    updateTaskCounts();
}


/*
    updateTaskCounts()

    Calculates counts from the current DOM.
*/
function updateTaskCounts() {

    const taskItems =
        taskList.querySelectorAll(".task-item");


    let pending = 0;

    let completed = 0;


    taskItems.forEach((taskItem) => {

        if (taskItem.dataset.state === "completed") {

            completed += 1;

        } else if (taskItem.dataset.state === "pending") {

            pending += 1;
        }

    });


    // DO NOT hard-code these values.
    totalCount.textContent = taskItems.length;

    pendingCount.textContent = pending;

    completedCount.textContent = completed;
}


/*
    handleTaskListClick(event)

    SINGLE delegated click handler
    for Complete, Edit/Save, and Remove.
*/
function handleTaskListClick(event) {

    const clickedButton = event.target;


    // Identify the clicked action
    if (
        !clickedButton.matches(".complete-btn") &&
        !clickedButton.matches(".edit-btn") &&
        !clickedButton.matches(".remove-btn")
    ) {
        return;
    }


    // Find the task that owns the button
    const taskItem =
        clickedButton.closest(".task-item");


    if (!taskItem) {
        return;
    }


    // Complete
    if (clickedButton.matches(".complete-btn")) {

        toggleTaskComplete(taskItem);

        return;
    }


    // Edit / Save
    if (clickedButton.matches(".edit-btn")) {

        const editInput =
            taskItem.querySelector(".edit-input");


        if (editInput) {

            saveTaskEdit(taskItem);

        } else {

            beginTaskEdit(taskItem);
        }

        return;
    }


    // Remove
    if (clickedButton.matches(".remove-btn")) {

        removeTask(taskItem);
    }
}


/*
    loadSampleTasks()

    Creates the three required sample tasks
    using DocumentFragment.
*/
function loadSampleTasks() {

    const sampleTasks = [
        "Review DOM selectors",
        "Practice createElement",
        "Study event delegation"
    ];


    // Create DocumentFragment
    const fragment =
        document.createDocumentFragment();


    // Create all three task elements
    sampleTasks.forEach((taskText) => {

        const taskId = `task-${nextTaskId}`;

        nextTaskId += 1;


        const taskItem =
            createTaskElement(
                taskText,
                taskId
            );


        fragment.appendChild(taskItem);
    });


    // Append fragment ONCE
    taskList.appendChild(fragment);


    updateTaskCounts();


    // Clear message
    taskMessage.textContent = "";

    taskMessage.classList.remove("error");
}


/*
    EVENT DELEGATION

    Exactly ONE click listener on #taskList
    for task-level actions.
*/
taskList.addEventListener(
    "click",
    handleTaskListClick
);


/*
    Add Task button
*/
addTaskBtn.addEventListener(
    "click",
    () => {
        addTask(taskInput.value);
    }
);


/*
    Load Sample Tasks button
*/
loadSamplesBtn.addEventListener(
    "click",
    loadSampleTasks
);


/*
    Allow Enter key to add a task.
*/
taskInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            addTask(taskInput.value);
        }
    }
);


/*
    INITIAL APPLICATION STATE

    Task list starts empty.
    Counts are calculated from the DOM.
*/
updateTaskCounts();