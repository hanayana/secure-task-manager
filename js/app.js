// ==========================================
// SECURE DYNAMIC TASK MANAGER
// ==========================================


// ==========================================
// SELECT REQUIRED DOM ELEMENTS
// ==========================================

const taskInput = document.querySelector("#taskInput");

const addTaskBtn = document.querySelector("#addTaskBtn");

const loadSamplesBtn =
    document.querySelector("#loadSamplesBtn");

const taskList =
    document.querySelector("#taskList");

const taskMessage =
    document.querySelector("#taskMessage");

const totalCount =
    document.querySelector("#totalCount");

const pendingCount =
    document.querySelector("#pendingCount");

const completedCount =
    document.querySelector("#completedCount");


// ==========================================
// UNIQUE TASK ID COUNTER
// ==========================================

let nextTaskId = 1;


// ==========================================
// CREATE TASK ELEMENT
// ==========================================

function createTaskElement(taskText, taskId) {

    // Create the <li>
    const taskItem =
        document.createElement("li");

    taskItem.classList.add("task-item");

    taskItem.dataset.taskId = taskId;

    taskItem.dataset.state = "pending";


    // Create task text <span>
    const taskTextSpan =
        document.createElement("span");

    taskTextSpan.classList.add("task-text");

    // IMPORTANT:
    // textContent prevents HTML/script injection.
    taskTextSpan.textContent = taskText;


    // Create Complete button
    const completeBtn =
        document.createElement("button");

    completeBtn.type = "button";

    completeBtn.classList.add("complete-btn");

    completeBtn.textContent = "Complete";


    // Create Edit button
    const editBtn =
        document.createElement("button");

    editBtn.type = "button";

    editBtn.classList.add("edit-btn");

    editBtn.textContent = "Edit";


    // Create Remove button
    const removeBtn =
        document.createElement("button");

    removeBtn.type = "button";

    removeBtn.classList.add("remove-btn");

    removeBtn.textContent = "Remove";


    // Add all children to taskItem
    taskItem.appendChild(taskTextSpan);

    taskItem.appendChild(completeBtn);

    taskItem.appendChild(editBtn);

    taskItem.appendChild(removeBtn);


    // IMPORTANT:
    // This function does NOT append to #taskList.
    return taskItem;
}


// ==========================================
// ADD TASK
// ==========================================

function addTask(taskText) {

    // Remove leading/trailing whitespace
    const trimmedText =
        taskText.trim();


    // Validate empty input
    if (trimmedText === "") {

        taskMessage.textContent =
            "Task cannot be empty";

        taskMessage.classList.add("error");

        taskInput.focus();

        return;
    }


    // Create unique task ID
    const taskId =
        `task-${nextTaskId}`;

    nextTaskId += 1;


    // Create task element
    const taskItem =
        createTaskElement(
            trimmedText,
            taskId
        );


    // Add task to DOM
    taskList.appendChild(taskItem);


    // Clear input
    taskInput.value = "";


    // Clear validation message
    taskMessage.textContent = "";

    taskMessage.classList.remove("error");


    // Update summary
    updateTaskCounts();


    // Return focus to input
    taskInput.focus();
}


// ==========================================
// TOGGLE TASK COMPLETE
// ==========================================

function toggleTaskComplete(taskItem) {

    // Toggle completed class
    taskItem.classList.toggle("completed");


    // Update data-state
    if (
        taskItem.classList.contains("completed")
    ) {

        taskItem.dataset.state =
            "completed";

    } else {

        taskItem.dataset.state =
            "pending";
    }


    // Update summary
    updateTaskCounts();
}


// ==========================================
// BEGIN TASK EDIT
// ==========================================

function beginTaskEdit(taskItem) {

    // Find current text
    const taskTextSpan =
        taskItem.querySelector(".task-text");


    // Find Edit button
    const editButton =
        taskItem.querySelector(".edit-btn");


    // Safety check
    if (!taskTextSpan || !editButton) {
        return;
    }


    // Create edit input
    const editInput =
        document.createElement("input");


    editInput.type = "text";

    editInput.classList.add("edit-input");


    // Put current text into input
    editInput.value =
        taskTextSpan.textContent;


    // Replace span with input
    taskTextSpan.replaceWith(editInput);


    // Change Edit to Save
    editButton.textContent = "Save";


    // Focus input
    editInput.focus();

    editInput.select();
}


// ==========================================
// SAVE TASK EDIT
// ==========================================

function saveTaskEdit(taskItem) {

    // Find edit input
    const editInput =
        taskItem.querySelector(".edit-input");


    // Find Edit/Save button
    const editButton =
        taskItem.querySelector(".edit-btn");


    // Safety check
    if (!editInput || !editButton) {
        return;
    }


    // Get edited text
    const trimmedText =
        editInput.value.trim();


    // Validate
    if (trimmedText === "") {

        taskMessage.textContent =
            "Task cannot be empty";

        taskMessage.classList.add("error");

        editInput.focus();

        return;
    }


    // Create new span
    const taskTextSpan =
        document.createElement("span");


    taskTextSpan.classList.add("task-text");


    // IMPORTANT:
    // Use textContent for edited text.
    taskTextSpan.textContent =
        trimmedText;


    // Replace input with span
    editInput.replaceWith(taskTextSpan);


    // Change Save back to Edit
    editButton.textContent = "Edit";


    // Clear validation message
    taskMessage.textContent = "";

    taskMessage.classList.remove("error");
}


// ==========================================
// REMOVE TASK
// ==========================================

function removeTask(taskItem) {

    // Remove only this task
    taskItem.remove();


    // Update summary
    updateTaskCounts();
}


// ==========================================
// UPDATE TASK COUNTS
// ==========================================

function updateTaskCounts() {

    // Get all current task items
    const taskItems =
        taskList.querySelectorAll(".task-item");


    let pending = 0;

    let completed = 0;


    // Check every task
    taskItems.forEach(
        (taskItem) => {

            if (
                taskItem.dataset.state ===
                "completed"
            ) {

                completed += 1;

            } else if (
                taskItem.dataset.state ===
                "pending"
            ) {

                pending += 1;
            }
        }
    );


    // Display counts
    totalCount.textContent =
        taskItems.length;

    pendingCount.textContent =
        pending;

    completedCount.textContent =
        completed;
}


// ==========================================
// EVENT DELEGATION
// ==========================================

function handleTaskListClick(event) {

    // The actual clicked element
    const clickedButton =
        event.target;


    // Ignore clicks that are not task buttons
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


    // Safety check
    if (!taskItem) {
        return;
    }


    // Complete action
    if (
        clickedButton.matches(".complete-btn")
    ) {

        toggleTaskComplete(taskItem);

        return;
    }


    // Edit / Save action
    if (
        clickedButton.matches(".edit-btn")
    ) {

        // If currently editing, save.
        if (
            taskItem.querySelector(".edit-input")
        ) {

            saveTaskEdit(taskItem);

        } else {

            // Otherwise start editing.
            beginTaskEdit(taskItem);
        }

        return;
    }


    // Remove action
    if (
        clickedButton.matches(".remove-btn")
    ) {

        removeTask(taskItem);

        return;
    }
}


// ==========================================
// LOAD SAMPLE TASKS
// ==========================================

function loadSampleTasks() {

    // Required sample tasks
    const sampleTasks = [

        "Review DOM selectors",

        "Practice createElement",

        "Study event delegation"
    ];


    // Create DocumentFragment
    const fragment =
        document.createDocumentFragment();


    // Create all three tasks
    sampleTasks.forEach(
        (taskText) => {

            const taskId =
                `task-${nextTaskId}`;

            nextTaskId += 1;


            const taskItem =
                createTaskElement(
                    taskText,
                    taskId
                );


            fragment.appendChild(taskItem);
        }
    );


    // IMPORTANT:
    // Append fragment to taskList ONLY ONCE.
    taskList.appendChild(fragment);


    // Update counts
    updateTaskCounts();


    // Clear validation message
    taskMessage.textContent = "";

    taskMessage.classList.remove("error");
}


// ==========================================
// ONE DELEGATED CLICK LISTENER
// ==========================================

taskList.addEventListener(
    "click",
    handleTaskListClick
);


// ==========================================
// ADD TASK BUTTON
// ==========================================

addTaskBtn.addEventListener(
    "click",
    () => {

        addTask(taskInput.value);
    }
);


// ==========================================
// LOAD SAMPLE BUTTON
// ==========================================

loadSamplesBtn.addEventListener(
    "click",
    loadSampleTasks
);


// ==========================================
// ENTER KEY SUPPORT
// ==========================================

taskInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            addTask(taskInput.value);
        }
    }
);


// ==========================================
// INITIAL STATE
// ==========================================

updateTaskCounts();