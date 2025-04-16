const Task = require("../model/Task");
const fs = require("fs");
const path = require("path");

exports.createTask = async (req, res) => {
  const { title, description } = req.body;
  const image = req.file ? req.file.path : "";
  try {
    const task = new Task({ title, description, image, user: req.user.id });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  const decoded = req.user;
  const { search, sortBy } = req.query;
  let query = {};
  if (decoded.role == "user") {
    query.user = req.user.id;
  }
  if (search) query.title = { $regex: search, $options: "i" };
  try {
    const tasks = await Task.find(query)
      .populate({ path: "user", select: { username: 1, role: 1 } })
      .sort(sortBy || "-createdAt");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const image = req.file ? req.file.path : undefined;
  const decoded = req.user;
  try {
    const task = await Task.findById(id);
    if (decoded.role == "user") {
      if (!task || task.user.toString() !== req.user.id)
        return res.status(404).json({ message: "Task not found" });
    }
    task.title = title || task.title;
    task.description = description || task.description;
    if (image) {
      if (task.image && fs.existsSync(task.image)) {
        fs.unlinkSync(task.image);
      }
      task.image = image;
    }
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  const decoded = req.user;
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (decoded.role == "user") {
      if (!task || task.user.toString() !== req.user.id)
        return res.status(404).json({ message: "Task not found" });
    }
    if (task.image) {
      if (task.image && fs.existsSync(task.image)) {
        fs.unlinkSync(task.image);
      }
    }
    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
