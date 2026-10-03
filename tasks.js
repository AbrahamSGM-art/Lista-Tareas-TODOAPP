import fetchService from "./fetchService.js";

/**
 * @typedef {Object} Task
 * @property {string} id - El identificador de Tareas
 * @property {string} text - El nombre de la Tarea
 * @property {boolean} completed - Si la tarea se completo
 */

/** @type {Task[]} */
let tasks = [];

const PORT = 3000;
const API_RESOURCE = "/tasks";
const API_URL = `http://localhost:${PORT}${API_RESOURCE}`;

/**
 * Crea una nueva Tarea y lo agrega a la lista de Tareas.
 * @param {Object} payload - La data que va a ser utilizada para crear la Tarea.
 * @param {Task['text']} payload.text - El nombre de la Tarea.
 */
const addOne = async ({ text }) => {
  try {
    const newTask = { text , completed: false };
    const { data } = await fetchService.post(API_URL, newTask);
    tasks = tasks.concat(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Retorna todas las Tareas.
 * @returns {Task[]}
 */
const getAll = async () => {
  try {
    const { data } = await fetchService.get(API_URL);
    tasks = data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Elimina una Tarea por su id.
 * @param {Task['id']} id - El id de la Tarea a eliminar.
 */
const deleteOne = async (id) => {
  try {
    const { data } = await fetchService.del(`${API_URL}/${id}`);
    tasks = tasks.filter((task) => task.id !== id);
    return data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Actualiza una Tarea por su id.
 * @param {Task['id']} id - El id de la Tarea a actualizar.
 * @param {Object} payload - La data que va a ser utilizada para actualizar la Tarea.
 * @param {Task['completed']} payload.completed - El nombre de la Tarea
 */
const updateOne = async (id, { completed }) => {
  try {
    const updatedTask = { completed };
    const { data } = await fetchService.patch(`${API_URL}/${id}`, updatedTask);
    tasks = tasks.map((task) => (task.id === id ? data : task));
    return data;
  } catch (error) {
    console.log(error);
  }
};

const tasksService = {
  addOne,
  getAll,
  updateOne,
  deleteOne,
};

export default tasksService;
