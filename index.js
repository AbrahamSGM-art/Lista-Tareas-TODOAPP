const form = document.getElementById("main-task-list-form");
const input = document.getElementById("task-input");
const template = document.getElementById("task-template");
const taskList = document.querySelector(".task-list");
const errorMessage = document.querySelector(".error-message");
const totalCounter = document.querySelector(".total");
const completedCounter = document.querySelector(".completed-count");
const incompleteCounter = document.querySelector(".incomplete-count");

let tasks = [];

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

const loadTasks = () => {
     const storedTasks = localStorage.getItem("tasks");
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
};

const renderTask = (task) => {
    const clone = template.content.cloneNode(true);
    const taskTextElement = clone.querySelector(".task-text");
    taskTextElement.textContent = task.text;

    const taskItem = clone.querySelector(".task-item");
    taskItem.dataset.id = task.id;

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

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskText = input.value.trim();

    if (taskText === "") {
        errorMessage.textContent = "A task must be provided";
        return;
    }
    errorMessage.textContent = "";

     const newTask = {
        id: crypto.randomUUID(),
        text: taskText,
        completed: false,
    };

    tasks = tasks.concat(newTask);
    saveTasks();
    renderTask(newTask);
    updateCounters();
    input.value = "";

});

taskList.addEventListener("click", (event) => {
    const deleteBtn = event.target.closest(".delete-btn");
    if (!deleteBtn) return;

    const taskItem = deleteBtn.closest(".task-item");
    const taskId = taskItem.dataset.id;

    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks();

    taskItem.remove();
    updateCounters();
});

taskList.addEventListener("click" , (event) =>{
    const completeBtn = event.target.closest(".complete-btn");
    if (!completeBtn) return;

    const taskItem = completeBtn.closest(".task-item");
    const taskId = taskItem.dataset.id;
    
    tasks = tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks();

    taskItem.classList.toggle("completed");
    updateCounters();
})

loadTasks();
tasks.forEach(renderTask);
updateCounters();