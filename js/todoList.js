const todoList = {
  todos: dummyData.todos,

  addItem(name, completed) {
    const item = { id: Date.now(), name, completed }

    this.todos.push(item)
    
    console.table(this.todos)

    return item
  },

  removeItem(id) {
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id === id) {
        this.todos.splice(i, 1)
        break;
      }
    }
    
    console.table(this.todos)
  },

  reorderItems(newIndices) {
    const reorderedTodos = newIndices.map(index => this.todos[index])

    this.todos = reorderedTodos
    
    console.table(this.todos)
  }
}