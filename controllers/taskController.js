import Project from "../models/Project.js";
import Task from "../models/Task.js";

const addTask = async (req, res) => {
  const { project } = req.body;

  const projectOnDb = await Project.findById(project);

  if (!projectOnDb) {
    const error = new Error("Project not found");
    return res.status(404).json({ msg: error.message });
  }

  if (projectOnDb.creator.toString() !== req.user._id.toString()) {
    const error = new Error("You dont have permission to add tasks");
    return res.status(404).json({ msg: error.message });
  }

  try {
    const taskOnDb = await Task.create(req.body);
    return res.json(taskOnDb);
  } catch (error) {
    console.log(error);
  }
};

const getTask = async (req, res) => {};
const updateTask = async (req, res) => {};
const deleteTask = async (req, res) => {};
const changeTaskState = async (req, res) => {};

export { addTask, getTask, updateTask, deleteTask, changeTaskState };
