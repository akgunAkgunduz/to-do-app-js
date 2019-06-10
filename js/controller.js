const controller = {
  addTodo(name, completed) {
    const todo = todoList.addItem(name, completed)

    view.addItem(todo)
  },

  removeTodo(id) {
    todoList.removeItem(id)

    view.removeItem(id)
  }
}