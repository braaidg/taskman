import Project from "../models/Project.js";
import User from "../models/User.js";

const getProjects = async (req, res) => {
  const projects = await Project.find()
    .where("creator")
    .equals(req.user)
    .select("-tasks");
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
    const project = await Project.findById(id)
      .populate("tasks")
      .populate("collaborators", "name email");

    if (!project) {
      const error = new Error("Project not found");
      return res.status(404).json({ msg: error.message });
    }

    if (project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("You dont have permissions to do that");
      return res.status(401).json({ msg: error.message });
    }

    res.json(project);
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

const deleteProject = async (req, res) => {
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

    await projectFromDb.deleteOne();
    res.json({ msg: "Project deleted" });
  } catch (error) {
    return res.status(400).json({ msg: "Action not valid" });
  }
};
const searchCollaborator = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select(
    "-confirmed -createdAt -token -password -updatedAt -__v"
  );

  if (!user) {
    const error = new Error("User not found");
    return res.status(404).json({ msg: error.message });
  }
  res.json(user);
};

const addCollaborator = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error("Project not found");
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Action not valid");
    return res.status(404).json({ msg: error.message });
  }

  const { email } = req.body;
  const user = await User.findOne({ email }).select(
    "-confirmed -createdAt -token -password -updatedAt -__v"
  );

  if (!user) {
    const error = new Error("User not found");
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() === user._id.toString()) {
    const error = new Error("Project creator can't be a collaborator");
    return res.status(404).json({ msg: error.message });
  }

  if (project.collaborators.includes(user._id)) {
    const error = new Error("User is already a collaborator");
    return res.status(404).json({ msg: error.message });
  }

  project.collaborators.push(user._id);
  await project.save();
  res.json({ msg: "Collaborator added successfully" });
};

const deleteCollaborator = async (req, res) => {};

export {
  getProject,
  addCollaborator,
  deleteCollaborator,
  deleteProject,
  editProject,
  getProjects,
  newProject,
  searchCollaborator,
};
