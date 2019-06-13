const controller = {
  addTodo(name, completed) {
    const todo = todoList.addItem(name, completed)

    store.set(todoList.todos)

    view.addItem(todo)
    view.updateItemIndices()
  },

  removeTodo(id) {
    todoList.removeItem(id)

    store.set(todoList.todos)

    view.removeItem(id)
    view.updateItemIndices()
  },

  toggleTodoStatus(id, listItem) {
    const isCompleted = todoList.toggleItemStatus(id)

    store.set(todoList.todos)
    
    view.updateItemStyling(listItem, isCompleted)
  },

  updateTodoName(id, newName) {
    todoList.updateItemName(id, newName)

    store.set(todoList.todos)
  },

  reorderTodos(newIndices) {
    todoList.reorderItems(newIndices)

    store.set(todoList.todos)

    view.updateItemIndices()
  }
}