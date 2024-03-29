import Project from "../models/Project.js";
import Task from "../models/Task.js";

const addTask = async (req, res) => {
  const { project } = req.body;
  try {
    const projectOnDb = await Project.findById(project);

    if (!projectOnDb) {
      const error = new Error("Project not found");
      return res.status(404).json({ msg: error.message });
    }

    if (projectOnDb.creator.toString() !== req.user._id.toString()) {
      const error = new Error("You dont have permission to add tasks");
      return res.status(404).json({ msg: error.message });
    }

    const taskOnDb = await Task.create(req.body);
    projectOnDb.tasks.push(taskOnDb._id);
    await projectOnDb.save();
    return res.json(taskOnDb);
  } catch (error) {
    return res.status(400).json({ msg: "Task not found" });
  }
};

const getTask = async (req, res) => {
  const { id } = req.params;

  try {
    const taskOnDb = await Task.findById(id).populate("project");

    if (!taskOnDb) {
      const error = new Error("Task not found");
      return res.status(404).json({ msg: error.message });
    }

    if (taskOnDb.project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("You dont have permission to view that task");
      return res.status(403).json({ msg: error.message });
    }

    res.json(taskOnDb);
  } catch (error) {
    return res.status(404).json({ msg: "Task not found" });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const taskOnDb = await Task.findById(id).populate("project");

    if (!taskOnDb) {
      const error = new Error("Task not found");
      return res.status(404).json({ msg: error.message });
    }

    if (taskOnDb.project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("You dont have permission to modify that task");
      return res.status(403).json({ msg: error.message });
    }

    taskOnDb.name = req.body.name || taskOnDb.name;
    taskOnDb.description = req.body.description || taskOnDb.description;
    taskOnDb.priority = req.body.priority || taskOnDb.priority;
    taskOnDb.deadline = req.body.deadline || taskOnDb.deadline;

    const updatedTask = await taskOnDb.save();
    res.json(updatedTask);
  } catch (error) {
    return res.status(400).json({ msg: "Task not found" });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const taskOnDb = await Task.findById(id).populate("project");

    if (!taskOnDb) {
      const error = new Error("Task not found");
      return res.status(404).json({ msg: error.message });
    }

    if (taskOnDb.project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("You dont have permission to delete that task");
      return res.status(403).json({ msg: error.message });
    }

    const project = await Project.findById(taskOnDb.project);
    project.tasks.pull(taskOnDb._id);

    Promise.allSettled([await project.save(), await taskOnDb.deleteOne()]);

    res.json({ msg: "Task successfully deleted" });
  } catch (error) {
    return res.status(400).json({ msg: "Task not found" });
  }
};

const changeTaskState = async (req, res) => {
  const { id } = req.params;
  try {
    const taskOnDb = await Task.findById(id).populate("project");

    if (!taskOnDb) {
      const error = new Error("Task not found");
      return res.status(404).json({ msg: error.message });
    }
    if (
      taskOnDb.project.creator.toString() !== req.user._id.toString() &&
      !taskOnDb.project.collaborators.some(
        (collab) => collab._id.toString() === req.user._id.toString()
      )
    ) {
      const error = new Error("You don't have permissions to do that");
      return res.status(401).json({ msg: error.message });
    }
    taskOnDb.state = !taskOnDb.state;
    taskOnDb.completed_by = req.user._id;
    await taskOnDb.save();

    const taskSaved = await Task.findById(id)
      .populate("project")
      .populate("completed_by");
    res.json(taskSaved);
  } catch (error) {
    console.log(error);
  }
};

export { addTask, getTask, updateTask, deleteTask, changeTaskState };
