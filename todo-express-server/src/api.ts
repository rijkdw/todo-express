import express, { Application, Request, Response } from "express";
import { readFileSync, writeFileSync } from "fs";

const app: Application = express();
const PORT: number = 8000;

// Read the list of to-do items
let todo = readFileSync("todo.txt", "utf8").split("\n");

// Write the current list of items to a file
function commitToStorageUsingResponse(res: Response) {
  try {
    writeFileSync("todo.txt", todo.join("\n"));
  } catch (error) {
    res
      .status(500)
      .json({ error: "Some error in writing the items to storage: " + error });
  }
}

// set headers
app.use((req, res, next) => {
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  });
  next();
});

// Use JSON middleware
app.use(express.json());

// logging
app.use((req, res, next) => {
  console.log("Got a request!");
  console.log("method", req.method);
  console.log("body", req.body);
  next();
});

// A dummy getter
app.get("/", (req: Request, res: Response): void => {
  res.status(200).send("hello world");
});

// Get all todo-list items
app.get("/todo", (req: Request, res: Response): void => {
  res.status(200).send(todo);
});

// Add a todo item
app.post("/todo", (req: Request, res: Response): void => {
  // get the item from the request
  const { item } = req.body;
  // check if the item is actually given
  if (item === undefined) {
    res.status(400).json({ error: "Item is undefined." });
    return;
  }
  // check if the item is already there
  if (todo.includes(item)) {
    res.status(400).json({ error: 'Item "' + item + '" already exists.' });
    return;
  }
  // add it
  todo.push(item);

  commitToStorageUsingResponse(res);
  res
    .status(200)
    .json({ message: 'Added item "' + item + '" at #' + todo.length + "." });
});

// Change a todo item
app.put("/todo/:id", (req: Request, res: Response): void => {
  const { id } = req.params;
  // check if there is an item with that id
  if (todo.length <= parseInt(id)) {
    res.status(400).json({ error: "No item exists at #" + id + "." });
    return;
  }
  // check if such an item already exists
  const { item } = req.body;
  if (todo.includes(item)) {
    res.status(400).json({ error: 'Item "' + item + '" already exists.' });
    return;
  }
  // set it
  todo[parseInt(id)] = item;

  commitToStorageUsingResponse(res);
  res
    .status(200)
    .json({ message: "Changed item #" + id + ' to "' + item + '".' });
});

// Delete an item
app.delete("/todo/:id", (req: Request, res: Response): void => {
  const { id } = req.params;
  // check if an item with that id exists
  if (todo.length <= parseInt(id)) {
    res.status(400).json({ error: "No item exists at #" + id + "." });
    return;
  }
  // Remove the item
  const deletedItem = todo.filter((x, i) => i === parseInt(id))[0];
  todo = todo.filter((x, i) => i !== parseInt(id));

  commitToStorageUsingResponse(res);
  res
    .status(200)
    .json({ message: "Deleted item #" + id + ', was "' + deletedItem + '".' });
});

app.listen(PORT, (): void => {
  console.log("Server is running on port", PORT);
});
