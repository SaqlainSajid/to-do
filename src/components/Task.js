import React, { useState } from "react";
import "../assets/Task.css";

function Task(props) {
  const [isChecked, setIsChecked] = useState(false); // State to track checkbox

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle the checked state
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
