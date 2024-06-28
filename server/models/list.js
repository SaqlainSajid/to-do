const mongoose = require("mongoose");
const TaskSchema = require("./task").schema; // Assuming Task schema is in 'Task.js'

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "New List",
  },
  tasks: [TaskSchema], // Embedding Task schema as an array of tasks
  priority: {
    type: Number,
    default: 100,
  },
});

const List = mongoose.model("List", listSchema);
module.exports = List;
