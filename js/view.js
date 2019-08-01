const view = {
  grid: new Muuri('#grid', { 
    dragEnabled: true,
    dragStartPredicate: {
      handle: '.handle'
    }
  }),

  list: document.getElementById('grid'),

  input: document.getElementById('add-item'),

  initList() {
    todoList.todos.forEach(todo => {
      this.addItemToGrid(todo)
    })

    this.updateItemIndices()
  },

  addItemToGrid({ id, name, completed }) {
    const itemDiv = document.createElement('div')
    const itemContentDiv = templates.createTodoItemContent(id, name, completed)

    itemDiv.classList.add('item')
    itemDiv.dataset.id = id
    itemDiv.innerHTML = itemContentDiv

    this.updateItemStyling(itemDiv, completed)
    this.addEventListenersForTodoItem(itemDiv)    
    this.grid.add(itemDiv)
  },

  removeItemFromGrid(id) {
    const item = document.querySelector(`.item[data-id="${id}"]`)

    this.removeEventListenersFromTodoItem(item)
    this.grid.remove(item, { removeElements: true })
  },

  updateItemName(id, newName) {
    this.list.querySelector(`.todo-content[data-id="${id}"]`).innerText = newName
  },

  updateItemStyling(item, isCompleted) {
    const content = item.querySelector('.todo-content')
    
    isCompleted ? content.classList.add('completed') : content.classList.remove('completed')
  },

  updateItemIndices() {
    const items = this.grid.getItems()
    
    items.forEach((item, i) => item.getElement().dataset.index = i)
  },

  // Event Handlers

  handleInputKeydown(e) {
    if (e.key === 'Enter') {
      const name = e.target.value.trim()
      
      if (name !== '') {
        controller.addTodo(name, false)
        e.target.value = ''
      }
    }
  },

  handleGridDragReleaseEnd(item) {
    const indices = []

    const grid = item.getGrid()
    const items = grid.getItems()

    items.forEach(item => indices.push(item.getElement().dataset.index))

    controller.reorderTodos(indices)
  },

  handleToggleClick(e) {
    const listItem = e.target.closest('.item')
    const id = parseInt(listItem.dataset.id)

    controller.toggleTodoStatus(id, listItem)
  },

  handleTodoContentDoubleClick(e) {
    const listItem = e.target.closest('.item')
    const editInput = listItem.querySelector('.edit')

    editInput.classList.remove('hidden')
    editInput.value = e.target.innerText
    editInput.focus()
  },

  handleDeleteButtonClick(e) {
    const id = parseInt(e.target.closest('.item').dataset.id)
    
    controller.removeTodo(id)
  },

  handleEditInputBlur(e) {
    e.target.classList.add('hidden')
  },

  handleEditInputKeyup(e) {
    if (e.key === 'Enter') {
      const id = parseInt(e.target.dataset.id)
      const newName = e.target.value.trim()

      if (newName !== '') {
        controller.updateTodoName(id, newName)
        view.updateItemName(id, newName)
        e.target.blur()
      }
    }

    if (e.key === 'Escape') {
      e.target.blur()
    }
  },

  // Event Listeners

  setUpEventListeners() {
    this.input.addEventListener('keydown', this.handleInputKeydown)
    this.grid.on('dragReleaseEnd', this.handleGridDragReleaseEnd)
  },

  addEventListenersForTodoItem(item) {
    const toggleDiv = item.querySelector('.check-mark')
    const todoContentDiv = item.querySelector('.todo-content')
    const deleteButton = item.querySelector('.del-btn')
    const editInput = item.querySelector('.edit')

    toggleDiv.addEventListener('click', this.handleToggleClick)
    todoContentDiv.addEventListener('dblclick', this.handleTodoContentDoubleClick)
    deleteButton.addEventListener('click', this.handleDeleteButtonClick) 
    editInput.addEventListener('blur', this.handleEditInputBlur)
    editInput.addEventListener('keyup', this.handleEditInputKeyup)
  },

  removeEventListenersFromTodoItem(item) {
    const toggleDiv = item.querySelector('.check-mark')
    const todoContentDiv = item.querySelector('.todo-content')
    const deleteButton = item.querySelector('.del-btn')
    const editInput = item.querySelector('.edit')

    toggleDiv.removeEventListener('click', this.handleToggleClick)
    todoContentDiv.removeEventListener('dblclick', this.handleTodoContentDoubleClick)
    deleteButton.removeEventListener('click', this.handleDeleteButtonClick)
    editInput.removeEventListener('blur', this.handleEditInputBlur)
    editInput.removeEventListener('keyup', this.handleEditInputKeyup)
  }
}