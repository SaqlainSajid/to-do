const express = require("express");
const router = express.Router();
const List = require("../models/list");
const Task = require("../models/task");

//Get All
//http://localhost:3000/doctors
//error code 500 means, it's a server error
router.get("/", async (req, res) => {
  try {
    const lists = await List.find({}).sort({ createdAt: 1 }).exec();
    res.json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Create One
//http://localhost:3000/doctors
//code 201 means successful creation
//code 400 means there's something wrong with the user input
router.post("/", async (req, res) => {
  const list = new List({
    name: req.body.name,
    tasks: [],
  });

  try {
    const newList = await list.save();
    res.json(newList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Check task Uncheck task
router.patch("/:listId/tasks/:taskId", async (req, res) => {
  const { listId, taskId } = req.params;
  const { completed } = req.body;

  try {
    // Find the list and then the task to update
    const list = await List.findById(listId);
    const task = list.tasks.id(taskId); // Assuming tasks are subdocuments in lists
    task.completed = completed; // Update the completed status
    await list.save(); // Save the parent document

    res.json(task); // Send back the updated task
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send("Error updating task");
  }
});

//Delete One
router.delete("/:id", async (req, res) => {
  const listId = req.params.id;

  try {
    // First, find the list to access its tasks
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // If the list has tasks, delete each one
    if (list.tasks && list.tasks.length > 0) {
      const taskDeletionPromises = list.tasks.map((taskId) =>
        Task.findByIdAndDelete(taskId)
      );
      // Wait for all task deletions to complete
      await Promise.all(taskDeletionPromises);
    }

    // After tasks are deleted, delete the list itself
    await List.findByIdAndDelete(listId); // Removes the document

    res
      .status(200)
      .json({ message: "List and related tasks deleted successfully" });
  } catch (err) {
    console.error("Error deleting list and tasks:", err);
    res.status(500).json({ message: err.message });
  }
});

//add task
router.patch("/:listId/tasks", async (req, res) => {
  const { listId } = req.params;
  const { text } = req.body; // Extract text from the request body

  if (!text) {
    return res.status(400).json({ message: "Task text must be provided" });
  }

  try {
    // Create a new task instance
    const newTask = new Task({
      text: text,
      completed: false, // Set default completion status
    });

    // Save the new task
    const savedTask = await newTask.save();

    // Find the list by ID and add the new task ID to it
    const updatedList = await List.findByIdAndUpdate(
      listId,
      { $push: { tasks: savedTask } }, // Assuming tasks is an array of task IDs
      { new: true }
    );

    if (!updatedList) {
      return res.status(404).json({ message: "List not found" });
    }

    // Return the newly created task
    res.json(savedTask);
  } catch (err) {
    console.error("Error adding task to list:", err);
    res.status(500).json({ message: err.message });
  }
});

//delete a task
router.delete("/:listId/tasks/:taskId", async (req, res) => {
  try {
    const { listId, taskId } = req.params;
    // This assumes your List model contains an array of task IDs or references
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }
    // Remove the task from the tasks array or delete separately if stored in another collection
    const taskIndex = list.tasks.findIndex((t) => t._id.toString() === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }
    list.tasks.splice(taskIndex, 1); // Remove the task from the array
    await list.save(); // Save the updated list
    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
