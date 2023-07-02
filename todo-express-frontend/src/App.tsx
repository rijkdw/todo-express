import React, { useEffect, useState } from "react";
import "./App.css";
import TodoListContext from "./components/todolistcontext";
import {
  addTodoListItem,
  deleteTodoListItem,
  fetchTodoList,
} from "./api_calls";

const NO_ERROR = "no error";

function App() {
  const [data, setData] = useState<string[]>([]);
  const [newInput, setNewInput] = useState<string>("");
  const [error, setError] = useState<string>(NO_ERROR);
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      const newData = await fetchTodoList();
      setData(newData);
    };
    loadData();
  }, [counter]);

  const handleDeleteButton = async (id: number) => {
    const response = await deleteTodoListItem(id);
    if (!response.ok) {
      setError((await response.json()).error);
    } else {
      setError(NO_ERROR);
    }
    setCounter(counter + 1);
  };

  const handleRandomAddButton = async () => {
    const response = await addTodoListItem("Rijk");
    if (!response.ok) {
      setError((await response.json()).error);
    } else {
      setError(NO_ERROR);
    }
    setCounter(counter + 1);
  };

  return (
    <main>
      <h1>TODO list</h1>
      {data.map((x, i) => (
        <>
          <input key={i} value={x} />
          <button onClick={async () => handleDeleteButton(i)}>X</button>
        </>
      ))}
      <br />
      <button onClick={async () => handleRandomAddButton()}>
        Add random item
      </button>
      <p className={error === NO_ERROR ? "" : "error"}>{error}</p>
    </main>
  );
}

export default App;
