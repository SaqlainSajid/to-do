import React from "react";

function Group(props) {
  return (
    <div className="group">
      <p>{props.children}</p>
    </div>
  );
}

export default Group;
