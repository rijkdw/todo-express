import express, { Application, Request, Response } from "express";
import { readFileSync, writeFileSync } from "fs";

const app: Application = express();
const PORT: number = 8000;

// Read the list of to-do items
let todo = readFileSync("todo.txt", "utf8").split("\n");

// Write the current list of items to a file
function commitToStorage(res: Response) {
  try {
    writeFileSync("todo.txt", todo.join("\n"));
  } catch (error) {
    res.status(500).json({error: "Some error in writing the items to storage."});
  }
}

// Use JSON middleware
app.use(express.json());

// A dummy getter
app.get("/", (req: Request, res: Response): void => {
  res.status(200).send("hello world");
});

// Get all todo-list items
app.get("/todo/all", (req: Request, res: Response): void => {
  res.status(200).send(todo);
});

// Add a todo item
app.post("/todo", (req: Request, res: Response): void => {
  // get the item from the request
  const { item } = req.body;
  // check if the item is already there
  if (todo.includes(item)) {
    res.status(400).json({ error: "Item already exists." });
    return;
  }
  // add it
  todo.push(item);

  commitToStorage(res);
  res.status(200).json({ message: "Added item #" + todo.length + "." });
});

// Change a todo item
app.put("/todo/:id", (req: Request, res: Response): void => {
  const { id } = req.params;
  // check if there is an item with that id
  if (todo.length <= parseInt(id)) {
    res.status(400).json({ error: "No item exists." });
    return;
  }
  // check if such an item already exists
  const { item } = req.body;
  if (todo.includes(item)) {
    res.status(400).json({ error: "Item already exists." });
    return;
  }
  // set it
  todo[parseInt(id)] = item;

  commitToStorage(res);
  res.status(200).json({ message: "Changed item #" + id + "." });
});

// Delete an item
app.delete("/todo/:id", (req: Request, res: Response): void => {
  const { id } = req.params;
  // check if an item with that id exists
  if (todo.length <= parseInt(id)) {
    res.status(400).json({ error: "No item exists." });
    return;
  }
  // Remove the item
  todo = todo.filter((x, i) => i !== parseInt(id));

  commitToStorage(res);
  res.status(200).json({ message: "Deleted item #" + id + "." });
});

app.listen(PORT, (): void => {
  console.log("Server is running on port", PORT);
});
