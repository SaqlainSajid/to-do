import "./App.css";
import SmallList from "./components/SmallList";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [showInput, setShowInput] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/lists").then((response) => {
      setList(response.data);
    });
  }, []);

  const handleAddClick = () => {
    setShowInput(true); // Show the input field
  };

  const handleInputChange = (event) => {
    setNewListName(event.target.value);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter" && newListName.trim() !== "") {
      axios
        .post("http://localhost:3000/lists", { name: newListName.trim() })
        .then((response) => {
          setList([...list, response.data]); // Assume the response contains the new list
          setNewListName(""); // Clear input field
          setShowInput(false); // Hide input field
        })
        .catch((error) => console.error("Error adding new list:", error));
    }
  };

  const removeListFromState = (listId) => {
    setList(list.filter((item) => item._id !== listId));
  };

  return (
    <div className="App">
      <header>
        <p>Tasks</p>
        <button type="button" onClick={handleAddClick}>
          +
        </button>
      </header>
      {showInput && (
        <input
          type="text"
          placeholder="Enter new list name"
          value={newListName}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          autoFocus
        />
      )}
      <div className="big-list">
        {list
          ? list.map((list) => (
              <SmallList key={list._id} onListDelete={removeListFromState}>
                {list}
              </SmallList>
            ))
          : null}
      </div>
    </div>
  );
}

export default App;
