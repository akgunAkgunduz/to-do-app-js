const view = {
  grid: new Muuri('#grid', { dragEnabled: true }),

  list: document.getElementById('grid'),

  input: document.getElementById('add-item'),

  initList() {
    todoList.todos.forEach(todo => {
      this.addItem(todo)
    })

    this.updateItemIndices()
  },

  addItem({ id, name, completed }) {
    const itemDiv = document.createElement('div')
    itemDiv.classList.add('item')
    itemDiv.dataset.id = id

    const itemContentDiv = document.createElement('div')
    itemContentDiv.classList.add('item-content')
    itemContentDiv.dataset.id = id

    let todoContentDiv = document.createElement('div')
    todoContentDiv.classList.add('todo-content')
    todoContentDiv.innerText = name
    todoContentDiv.dataset.id = id

    itemContentDiv.appendChild(todoContentDiv)
    itemDiv.appendChild(itemContentDiv)

    view.addEventListenersForItem(itemDiv)

    this.grid.add(itemDiv)
  },

  removeItem(id) {
    const item = document.querySelector(`.item[data-id="${id}"]`)

    this.grid.remove(item, { removeElements: true })
  },

  updateItemIndices() {
    const items = this.grid.getItems()
    
    items.forEach((item, i) => item.getElement().dataset.index = i)
  },

  setUpEventListeners() {
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const name = e.target.value.trim()
        
        if (name !== '') {
          controller.addTodo(name, false)
          e.target.value = ''
        }
      }
    })

    this.grid.on('dragReleaseEnd', (item) => {
      let indices = []

      let grid = item.getGrid()
      let items = grid.getItems()

      items.forEach(item => indices.push(item.getElement().dataset.index))

      controller.reorderTodos(indices)
    })
  },

  addEventListenersForItem(item) {
    item.addEventListener('dblclick', (e) => {
      const id = parseInt(e.target.dataset.id)

      controller.removeTodo(id)
    })
  }
}