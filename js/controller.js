const controller = {
  addTodo(name, completed) {
    const todo = todoList.addItem(name, completed)

    view.addItem(todo)
    view.updateItemIndices()
  },

  removeTodo(id) {
    todoList.removeItem(id)

    view.removeItem(id)
    view.updateItemIndices()
  },

  reorderTodos(newIndices) {
    todoList.reorderItems(newIndices)

    view.updateItemIndices()
  }
}