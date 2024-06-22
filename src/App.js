import "./App.css";
import SmallList from "./components/SmallList";

function App() {
  let taskList = [
    "hehe",
    "haha",
    "whattup",
    "Yo bro let's get it on abcd efg hijklmnop qrstuv wx yz",
  ];
  return (
    <div className="App">
      <p>Tasks</p>
      <div className="big-list">
        <SmallList>{taskList}</SmallList>
        <SmallList>{taskList}</SmallList>
        <SmallList>{taskList}</SmallList>
        <SmallList>{taskList}</SmallList>
        <SmallList>{taskList}</SmallList>
        <SmallList>{taskList}</SmallList>
        <SmallList>{taskList}</SmallList>
        <SmallList>{taskList}</SmallList>
        <SmallList>{taskList}</SmallList>
      </div>
    </div>
  );
}

export default App;
