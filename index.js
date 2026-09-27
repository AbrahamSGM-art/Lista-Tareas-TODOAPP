const form = document.getElementById("main-task-list-form");
const input = document.getElementById("task-input");
const template = document.getElementById("task-template");
const taskList = document.querySelector(".task-list");
const errorMessage = document.querySelector(".error-message");
const totalCounter = document.querySelector(".total");
const completedCounter = document.querySelector(".completed-count");
const incompleteCounter = document.querySelector(".incomplete-count");

let tasks = [];

const API_URL = "http://localhost:3000/tasks";

const loadTasks = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    tasks = data;
};

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

    const newTask = {
        text: taskText,
        completed: false,
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
    });
    const savedTask = await response.json();

    tasks = tasks.concat(savedTask);
    renderTask(savedTask);
    updateCounters();
    input.value = "";
});

taskList.addEventListener("click", async (event) => {
    const deleteBtn = event.target.closest(".delete-btn");
    if (!deleteBtn) return;

    const taskItem = deleteBtn.closest(".task-item");
    const taskId = taskItem.dataset.id;

    await fetch(`${API_URL}/${taskId}`, { method: "DELETE" });

    tasks = tasks.filter((task) => task.id !== taskId);
    taskItem.remove();
    updateCounters();
});

taskList.addEventListener("click", async (event) => {
    const completeBtn = event.target.closest(".complete-btn");
    if (!completeBtn) return;

    const taskItem = completeBtn.closest(".task-item");
    const taskId = taskItem.dataset.id;

    const currentTask = tasks.find((task) => task.id === taskId);

    await fetch(`${API_URL}/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentTask.completed }),
    });

    tasks = tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    taskItem.classList.toggle("completed");
    updateCounters();
});

const init = async () => {
    await loadTasks();
    tasks.forEach(renderTask);
    updateCounters();
};

init();