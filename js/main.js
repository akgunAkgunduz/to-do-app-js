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

  input: document.getElementById('#add-item'),

  initList() {
    todoList.todos.forEach(todo => {
      this.addItem(todo)
    })
  },

  addItem({ id, name, completed }) {
    const itemDiv = document.createElement('div')
    itemDiv.classList.add('item')
    itemDiv.dataset.id = id

    const itemContentDiv = document.createElement('div')
    itemContentDiv.classList.add('item-content')

    let todoContentDiv = document.createElement('div')
    todoContentDiv.classList.add('todo-content')
    todoContentDiv.innerText = name

    itemContentDiv.appendChild(todoContentDiv)
    itemDiv.appendChild(itemContentDiv)

    this.grid.add(itemDiv)
  },

  removeItem(id) {
    const item = document.querySelector(`.item[data-id="${id}"]`)

    this.grid.remove(item, { removeElements: true })
  }
}

console.table(todoList.todos)

view.initList()