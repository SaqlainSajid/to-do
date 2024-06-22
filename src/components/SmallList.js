import React, { useState } from "react";
import Group from "./Group";
import Task from "./Task";
import "../assets/SmallList.css";
import { FaTrash } from "react-icons/fa";

function SmallList(props) {
  const [tasks, setTasks] = useState(props.children);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveringDelete, setHoveringDelete] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [isNameEditable, setIsNameEditable] = useState(false);
  const [groupName, setGroupName] = useState("Name");

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleGroupNameKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsNameEditable(false); // Stop editing on Enter key
    }
  };

  const toggleEditName = () => {
    setIsNameEditable(true);
  };

  const handleDragStart = (e, position) => {
    e.dataTransfer.setData("taskPosition", position);
    setIsDragging(true);
  };

  const handleDrop = (e, position) => {
    const draggedTaskPosition = parseInt(
      e.dataTransfer.getData("taskPosition")
    );
    if (position !== draggedTaskPosition) {
      const newTasks = [...tasks];
      const task = newTasks.splice(draggedTaskPosition, 1)[0];
      newTasks.splice(position, 0, task);
      setTasks(newTasks);
    }
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
  };

  const handleDragEnterDelete = (e) => {
    setHoveringDelete(true);
    e.stopPropagation();
  };

  const handleDragLeaveDelete = (e) => {
    setHoveringDelete(false);
    e.stopPropagation();
  };

  const handleDragOverDelete = (e) => {
    e.preventDefault(); // This allows the drop action on the delete icon
    if (!hoveringDelete) {
      setHoveringDelete(true); // Set hoveringDelete if not already set
    }
  };

  const handleDeleteDrop = (e) => {
    const draggedTaskPosition = parseInt(
      e.dataTransfer.getData("taskPosition")
    );
    const newTasks = [...tasks];
    newTasks.splice(draggedTaskPosition, 1); // Remove the task
    setTasks(newTasks);
    setIsDragging(false); // Reset dragging state
    setHoveringDelete(false); // Reset hover state
    e.preventDefault(); // Prevent default to allow drop handling
    e.stopPropagation();
  };

  const handleAddClick = () => {
    setShowInput(true); // Show the input field
  };

  const handleInputChange = (e) => {
    setNewTask(e.target.value); // Update the new task value as the user types
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && newTask.trim() !== "") {
      setTasks([...tasks, newTask]); // Add the new task to the tasks array
      setNewTask(""); // Clear the input field
      setShowInput(false); // Hide the input field
    }
  };

  return (
    <div className="small-list">
      <header>
        {isNameEditable ? (
          <input
            type="text"
            value={groupName}
            onChange={handleGroupNameChange}
            onKeyDown={handleGroupNameKeyDown}
            onBlur={() => setIsNameEditable(false)} // Stop editing when focus is lost
            autoFocus
          />
        ) : (
          <div onDoubleClick={toggleEditName}>
            <Group>{groupName}</Group>
          </div>
        )}
        <button type="button" onClick={handleAddClick}>
          +
        </button>
        {isDragging && (
          <FaTrash
            className={`delete-icon ${hoveringDelete ? "grow" : ""}`}
            onDragEnter={handleDragEnterDelete}
            onDragLeave={handleDragLeaveDelete}
            onDrop={handleDeleteDrop}
            onDragOver={handleDragOverDelete}
          />
        )}
      </header>
      {tasks.map((task, index) => (
        <div
          key={index}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          className="draggable-task"
        >
          <Task>{task}</Task>
        </div>
      ))}
      {showInput && (
        <input
          type="text"
          value={newTask}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          autoFocus
          className="Input"
        />
      )}
    </div>
  );
}

export default SmallList;
