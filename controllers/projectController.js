import Project from "../models/Project.js";

const getProjects = async (req, res) => {
  const projects = await Project.find().where("creator").equals(req.user);
  res.json(projects);
};

const newProject = async (req, res) => {
  const project = new Project(req.body);
  project.creator = req.user._id;

  try {
    const projectOnDb = await project.save();
    res.json(projectOnDb);
  } catch (error) {
    console.log(error);
  }
};

const getProject = async (req, res) => {
  const { id } = req.params;
  try {
    const projectFromDb = await Project.findById(id);

    if (!projectFromDb) {
      const error = new Error("Project not found");
      return res.status(404).json({ msg: error.message });
    }

    if (projectFromDb.creator.toString() !== req.user._id.toString()) {
      const error = new Error("Action not valid");
      return res.status(401).json({ msg: error.message });
    }

    return res.json(projectFromDb);
  } catch (error) {
    return res.status(400).json({ msg: "Action not valid" });
  }
};

const editProject = async (req, res) => {
  const { id } = req.params;
  try {
    const projectFromDb = await Project.findById(id);

    if (!projectFromDb) {
      const error = new Error("Project not found");
      return res.status(404).json({ msg: error.message });
    }

    if (projectFromDb.creator.toString() !== req.user._id.toString()) {
      const error = new Error("Action not valid");
      return res.status(401).json({ msg: error.message });
    }

    projectFromDb.name = req.body.name || projectFromDb.name;
    projectFromDb.description =
      req.body.description || projectFromDb.description;
    projectFromDb.finishDate = req.body.finishDate || projectFromDb.finishDate;
    projectFromDb.client = req.body.client || projectFromDb.client;

    const projectUpdated = await projectFromDb.save();
    return res.json(projectUpdated);
  } catch (error) {
    return res.status(400).json({ msg: "Action not valid" });
  }
};

const deleteProject = async (req, res) => {};

const addCollaborator = async (req, res) => {};

const deleteCollaborator = async (req, res) => {};

const getTasks = async (req, res) => {};

export {
  getProject,
  addCollaborator,
  deleteCollaborator,
  deleteProject,
  editProject,
  getProjects,
  getTasks,
  newProject,
};
