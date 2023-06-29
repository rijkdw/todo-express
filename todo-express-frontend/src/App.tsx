import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  
  const [data, setData] = useState<string>("");

  useEffect(() => {
    const dataFetch = async () => {
      const response = await fetch("http://localhost:8000/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
        },
      });
      console.log("Before JSON()-ing: ");
      console.log(response);
      setData(await response.text());
    };
    dataFetch();
  }, []);

  return (
    <main>
      <h1>TODO list</h1>
      {data}
    </main>
  );
}

export default App;
