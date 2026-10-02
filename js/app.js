"use strict";

// ---------- Element references ----------
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const EMPTY_MESSAGE = "Task cannot be empty";
let taskCounter = 0;

// ---------- Helpers ----------
function generateTaskId() {
  taskCounter += 1;
  let id = "task-" + taskCounter;
  // Guarantee uniqueness against anything already in the DOM
  while (taskList.querySelector('[data-task-id="' + id + '"]')) {
    taskCounter += 1;
    id = "task-" + taskCounter;
  }
  return id;
}

function createButton(className, label) {
  const button = document.createElement("button");
  button.classList.add(className);
  button.type = "button";
  button.textContent = label;
  return button;
}

// ---------- Required functions ----------
function createTaskElement(taskText, taskId) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = "pending";

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = taskText;

  taskItem.appendChild(textSpan);
  taskItem.appendChild(createButton("complete-btn", "Complete"));
  taskItem.appendChild(createButton("edit-btn", "Edit"));
  taskItem.appendChild(createButton("remove-btn", "Remove"));

  return taskItem;
}

function addTask(taskText) {
  const text = taskText.trim();

  if (text === "") {
    taskMessage.textContent = EMPTY_MESSAGE;
    return;
  }

  const taskItem = createTaskElement(text, generateTaskId());
  taskList.appendChild(taskItem);

  taskInput.value = "";
  taskMessage.textContent = "";
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = isCompleted ? "completed" : "pending";
  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const textSpan = taskItem.querySelector(".task-text");
  const editButton = taskItem.querySelector(".edit-btn");
  if (!textSpan || !editButton) return;

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.classList.add("edit-input");
  editInput.value = textSpan.textContent;

  taskItem.replaceChild(editInput, textSpan);
  editButton.textContent = "Save";
  editInput.focus();
}

function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");
  const editButton = taskItem.querySelector(".edit-btn");
  if (!editInput || !editButton) return;

  const newText = editInput.value.trim();

  if (newText === "") {
    taskMessage.textContent = EMPTY_MESSAGE;
    return;
  }

  const newSpan = document.createElement("span");
  newSpan.classList.add("task-text");
  newSpan.textContent = newText;

  taskItem.replaceChild(newSpan, editInput);
  editButton.textContent = "Edit";
  taskMessage.textContent = "";
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

function updateTaskCounts() {
  const items = taskList.querySelectorAll(".task-item");
  let completed = 0;
  let pending = 0;

  items.forEach(function (item) {
    if (item.dataset.state === "completed") {
      completed += 1;
    } else {
      pending += 1;
    }
  });

  totalCount.textContent = items.length;
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
}

function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest(".task-item");
  if (!taskItem || !taskList.contains(taskItem)) return;

  if (target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (target.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (target.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const sampleTasks = [
    "Review DOM selectors",
    "Practice createElement",
    "Study event delegation"
  ];

  const fragment = document.createDocumentFragment();
  sampleTasks.forEach(function (text) {
    fragment.appendChild(createTaskElement(text, generateTaskId()));
  });

  taskList.appendChild(fragment);
  taskMessage.textContent = "";
  updateTaskCounts();
}

// ---------- Event listeners ----------
addTaskBtn.addEventListener("click", function () {
  addTask(taskInput.value);
});

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask(taskInput.value);
  }
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);

// The single delegated click listener for all task actions
taskList.addEventListener("click", handleTaskListClick);

// Initial state: empty list, counts calculated from the DOM
updateTaskCounts();