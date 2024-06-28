import React, { useState } from "react";
import Group from "./Group";
import Task from "./Task";
import "../assets/SmallList.css";
import { FaTrash } from "react-icons/fa";
import axios from "axios";

function SmallList(props) {
  const [tasks, setTasks] = useState(props.children.tasks);
  const [listId, setListId] = useState(props.children._id);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveringDelete, setHoveringDelete] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [isNameEditable, setIsNameEditable] = useState(false);
  const [groupName, setGroupName] = useState(props.children.name);
  const [isPriorityEditable, setIsPriorityEditable] = useState(false);
  const [priority, setPriority] = useState(props.children.priority);

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

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const handlePriorityKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsPriorityEditable(false);
      // Update priority in the backend
      axios
        .patch(`http://localhost:3000/lists/${listId}/priority`, {
          priority: e.target.value,
        })
        .then((response) => {
          console.log("Priority updated successfully", response.data);
          props.onPriorityChange(listId, e.target.value);
        })
        .catch((error) => {
          console.error("Failed to update priority:", error);
        });
    }
  };

  const toggleEditPriority = () => {
    setIsPriorityEditable(true);
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
    e.preventDefault();
    e.stopPropagation();
    const draggedTaskPosition = parseInt(
      e.dataTransfer.getData("taskPosition")
    );
    const taskToDelete = tasks[draggedTaskPosition];

    if (!taskToDelete) return; // If no task is found at the position, do nothing

    axios
      .delete(`http://localhost:3000/lists/${listId}/tasks/${taskToDelete._id}`)
      .then(() => {
        const updatedTasks = [...tasks];
        updatedTasks.splice(draggedTaskPosition, 1); // Remove the task from local state
        setTasks(updatedTasks);
        setIsDragging(false); // Reset dragging state
        setHoveringDelete(false); // Reset hover state
        console.log("Task deleted successfully");
      })
      .catch((error) => {
        console.error("Failed to delete task:", error);
      });
  };

  const handleAddClick = () => {
    setShowInput(true); // Show the input field
  };

  const handleInputChange = (e) => {
    setNewTask(e.target.value); // Update the new task value as the user types
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && newTask.trim() !== "") {
      axios
        .patch(`http://localhost:3000/lists/${listId}/tasks`, {
          text: newTask.trim(),
        })
        .then((response) => {
          console.log(response.data);
          setTasks([...tasks, response.data]); // Add the new task to the tasks array
          setNewTask(""); // Clear the input field
          setShowInput(false); // Hide the input field
        })
        .catch((error) => {
          console.error("Failed to add task:", error);
          // Optionally handle the error in the UI, e.g., show a message to the user
        });
    }
  };

  const handleDeleteList = () => {
    axios
      .delete(`http://localhost:3000/lists/${listId}`)
      .then(() => {
        // Assuming there's a prop function passed down to handle the removal in the parent component's state
        props.onListDelete(listId);
        console.log("List deleted successfully", listId, groupName);
      })
      .catch((error) => {
        console.error("Failed to delete list:", error);
      });
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
        {isPriorityEditable ? (
          <input
            type="number"
            value={priority}
            onChange={handlePriorityChange}
            onKeyDown={handlePriorityKeyDown}
            onBlur={() => setIsPriorityEditable(false)}
            autoFocus
          />
        ) : (
          <div onDoubleClick={toggleEditPriority}>
            <span className="priority">{priority}</span>
          </div>
        )}
        <button type="button" onClick={handleAddClick}>
          +
        </button>
        {!isDragging && (
          <FaTrash className={`delete-icon`} onClick={handleDeleteList} />
        )}
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
          <Task
            key={task._id}
            listId={listId}
            taskId={task._id}
            checked={task.completed}
          >
            {task.text}
          </Task>
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
