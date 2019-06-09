const todoList = {
  todos: dummyData.todos,

  addItem(name, completed) {
    const item = { id: Date.now(), name, completed }

    this.todos.push(item)
    
    console.table(this.todos)
  },

  removeItem(id) {
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id === id) {
        this.todos.splice(i, 1)
        break;
      }
    }
    
    console.table(this.todos)
  }
}

const view = {
  grid: new Muuri('#grid', { dragEnabled: true }),
  list: document.getElementById('#grid'),
  input: document.getElementById('#add-item')
}

console.table(todoList.todos)