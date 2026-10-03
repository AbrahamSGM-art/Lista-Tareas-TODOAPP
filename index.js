import tasksService from "./tasks.js";

const form = document.getElementById("main-task-list-form");
const input = document.getElementById("task-input");
const template = document.getElementById("task-template");
const taskList = document.querySelector(".task-list");
const errorMessage = document.querySelector(".error-message");
const totalCounter = document.querySelector(".total");
const completedCounter = document.querySelector(".completed-count");
const incompleteCounter = document.querySelector(".incomplete-count");

const renderTask = (task) => {
    const clone = template.content.cloneNode(true);
    const taskTextElement = clone.querySelector(".task-text");
    taskTextElement.textContent = task.text;

    const taskItem = clone.querySelector(".task-item");
    taskItem.dataset.id = task.id;

    if (task.completed) {
        taskItem.classList.add("completed");
    }

    taskList.appendChild(clone);
};

const updateCounters = () => {
    const total = taskList.children.length;
    const completed = taskList.querySelectorAll(".task-item.completed").length;
    const incomplete = total - completed;

    totalCounter.textContent = `Total: ${total}`;
    completedCounter.textContent = `Completed: ${completed}`;
    incompleteCounter.textContent = `Incompleted: ${incomplete}`;
};

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const taskText = input.value.trim();

    if (taskText === "") {
        errorMessage.textContent = "A task must be provided";
        return;
    }
    errorMessage.textContent = "";

    const savedTask = await tasksService.addOne({ text: taskText });
    if (!savedTask) return;

    renderTask(savedTask);
    updateCounters();
    input.value = "";
});

taskList.addEventListener("click", async (event) => {
    const deleteBtn = event.target.closest(".delete-btn");
    if (!deleteBtn) return;

    const taskItem = deleteBtn.closest(".task-item");
    const taskId = taskItem.dataset.id;

    const deleted = await tasksService.deleteOne(taskId);
    if (!deleted) return;

    taskItem.remove();
    updateCounters();
});

taskList.addEventListener("click", async (event) => {
    const completeBtn = event.target.closest(".complete-btn");
    if (!completeBtn) return;

    const taskItem = completeBtn.closest(".task-item");
    const taskId = taskItem.dataset.id;

    const isCompleted = taskItem.classList.contains("completed");

    const updatedTask = await tasksService.updateOne(taskId, {
        completed: !isCompleted,
    });
    if (!updatedTask) return;

    taskItem.classList.toggle("completed", updatedTask.completed);
    updateCounters();
});

const init = async () => {
    const tasks = await tasksService.getAll();
    if (!tasks) return;

    tasks.forEach(renderTask);
    updateCounters();
};

init();