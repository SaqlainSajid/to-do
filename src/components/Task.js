import React, { useState } from "react";
import "../assets/Task.css";
import axios from "axios";

function Task(props) {
  const [isChecked, setIsChecked] = useState(props.checked); // State to track checkbox

  const handleCheckboxChange = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState); // Toggle the checked state locally first

    // Prepare URL and payload for the API request
    const url = `http://localhost:3000/lists/${props.listId}/tasks/${props.taskId}`;
    const payload = { completed: newCheckedState };

    // Make an API call to update the task in the database
    axios
      .patch(url, payload)
      .then((response) => {
        console.log("Task update successful:", response.data);
        // Optionally perform actions after a successful update
      })
      .catch((error) => {
        console.error("Failed to update task:", error);
        // Optionally revert the checkbox state if the update fails
        setIsChecked(!newCheckedState);
      });
  };

  return (
    <div className="task">
      <p className={isChecked ? "strikethrough" : ""}>{props.children}</p>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
    </div>
  );
}

export default Task;
