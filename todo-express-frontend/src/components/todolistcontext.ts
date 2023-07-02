import { Dispatch, createContext } from "react";

export type TodoListContextType = {
  state: string[];
  setState: Dispatch<string[]>;
};

const TodoListContext = createContext<TodoListContextType>({
  state: [],
  setState: () => {},
});

export default TodoListContext;