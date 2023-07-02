export const fetchTodoList = async () => {
  const response = await fetch("http://localhost:8000/todo", {
    method: "GET",
    mode: "cors",
  });
  const newData = await response.json();
  return newData;
};

export const addTodoListItem = async (item: string) => {
  const response = await fetch("http://localhost:8000/todo", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({item}),
  });
  return response;
};

export const deleteTodoListItem = async (id: number) => {
  const response = await fetch("http://localhost:8000/todo/" + id, {
    method: "DELETE",
    mode: "cors",
  });
  return response;
};
