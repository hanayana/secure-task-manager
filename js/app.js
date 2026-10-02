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
 * Creates one task element.
 * This function only creates and returns the element.
 * It does not append the task to #taskList.
 */
function createTaskElement(taskText, taskId) {
    const taskItem = document.createElement("li");

    taskItem.classList.add("task-item");
    taskItem.dataset.taskId = taskId;
    taskItem.dataset.state = "pending";

    const taskTextSpan = document.createElement("span");

    taskTextSpan.classList.add("task-text");
    taskTextSpan.textContent = taskText;

    const completeBtn = document.createElement("button");

    completeBtn.type = "button";
    completeBtn.classList.add("complete-btn");
    completeBtn.textContent = "Complete";

    const editBtn = document.createElement("button");

    editBtn.type = "button";
    editBtn.classList.add("edit-btn");
    editBtn.textContent = "Edit";

    const removeBtn = document.createElement("button");

    removeBtn.type = "button";
    removeBtn.classList.add("remove-btn");
    removeBtn.textContent = "Remove";

    taskItem.appendChild(taskTextSpan);
    taskItem.appendChild(completeBtn);
    taskItem.appendChild(editBtn);
    taskItem.appendChild(removeBtn);

    return taskItem;
}


/*
 * Adds a new task to the task list.
 */
function addTask(taskText) {
    const trimmedText = taskText.trim();

    if (trimmedText === "") {
        taskMessage.textContent = "Task cannot be empty";
        taskMessage.classList.add("error");
        taskInput.focus();
        return;
    }

    const taskId = `task-${nextTaskId}`;

    nextTaskId += 1;

    const taskItem = createTaskElement(
        trimmedText,
        taskId
    );

    taskList.appendChild(taskItem);

    taskInput.value = "";

    taskMessage.textContent = "";
    taskMessage.classList.remove("error");

    updateTaskCounts();

    taskInput.focus();
}


/*
 * Toggles the completed state of a task.
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
 * Begins editing the selected task.
 */
function beginTaskEdit(taskItem) {
    const taskTextSpan = taskItem.querySelector(".task-text");
    const editButton = taskItem.querySelector(".edit-btn");

    if (!taskTextSpan || !editButton) {
        return;
    }

    const editInput = document.createElement("input");

    editInput.type = "text";
    editInput.classList.add("edit-input");
    editInput.value = taskTextSpan.textContent;

    taskTextSpan.replaceWith(editInput);

    editButton.textContent = "Save";

    editInput.focus();
    editInput.select();
}


/*
 * Saves an edited task.
 */
function saveTaskEdit(taskItem) {
    const editInput = taskItem.querySelector(".edit-input");
    const editButton = taskItem.querySelector(".edit-btn");

    if (!editInput || !editButton) {
        return;
    }

    const trimmedText = editInput.value.trim();

    if (trimmedText === "") {
        taskMessage.textContent = "Task cannot be empty";
        taskMessage.classList.add("error");

        editInput.focus();

        return;
    }

    const taskTextSpan = document.createElement("span");

    taskTextSpan.classList.add("task-text");
    taskTextSpan.textContent = trimmedText;

    editInput.replaceWith(taskTextSpan);

    editButton.textContent = "Edit";

    taskMessage.textContent = "";
    taskMessage.classList.remove("error");
}


/*
 * Removes only the selected task.
 */
function removeTask(taskItem) {
    taskItem.remove();

    updateTaskCounts();
}


/*
 * Calculates task counts from the current DOM.
 */
function updateTaskCounts() {
    const taskItems = taskList.querySelectorAll(".task-item");

    let pending = 0;
    let completed = 0;

    taskItems.forEach((taskItem) => {
        if (taskItem.dataset.state === "completed") {
            completed += 1;
        } else if (taskItem.dataset.state === "pending") {
            pending += 1;
        }
    });

    totalCount.textContent = taskItems.length;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}


/*
 * Single delegated click handler for all task buttons.
 */
function handleTaskListClick(event) {
    const clickedButton = event.target;

    if (
        !clickedButton.matches(".complete-btn") &&
        !clickedButton.matches(".edit-btn") &&
        !clickedButton.matches(".remove-btn")
    ) {
        return;
    }

    const taskItem = clickedButton.closest(".task-item");

    if (!taskItem) {
        return;
    }

    if (clickedButton.matches(".complete-btn")) {
        toggleTaskComplete(taskItem);
        return;
    }

    if (clickedButton.matches(".edit-btn")) {
        const editInput = taskItem.querySelector(".edit-input");

        if (editInput) {
            saveTaskEdit(taskItem);
        } else {
            beginTaskEdit(taskItem);
        }

        return;
    }

    if (clickedButton.matches(".remove-btn")) {
        removeTask(taskItem);
    }
}


/*
 * Loads the three required sample tasks.
 * All tasks are created in a DocumentFragment,
 * then the fragment is appended to #taskList once.
 */
function loadSampleTasks() {
    const sampleTasks = [
        "Review DOM selectors",
        "Practice createElement",
        "Study event delegation"
    ];

    const fragment = document.createDocumentFragment();

    sampleTasks.forEach((taskText) => {
        const taskId = `task-${nextTaskId}`;

        nextTaskId += 1;

        const taskItem = createTaskElement(
            taskText,
            taskId
        );

        fragment.appendChild(taskItem);
    });

    taskList.appendChild(fragment);

    updateTaskCounts();

    taskMessage.textContent = "";
    taskMessage.classList.remove("error");
}


/*
 * Exactly one delegated click listener for task actions.
 */
taskList.addEventListener(
    "click",
    handleTaskListClick
);


/*
 * Add Task button.
 */
addTaskBtn.addEventListener(
    "click",
    () => {
        addTask(taskInput.value);
    }
);


/*
 * Load Sample Tasks button.
 */
loadSamplesBtn.addEventListener(
    "click",
    loadSampleTasks
);


/*
 * Allows Enter to add a task.
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
 * Set the correct initial counts.
 */
updateTaskCounts();