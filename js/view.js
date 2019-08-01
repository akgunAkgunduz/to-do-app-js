const view = {
  grid: new Muuri('#grid', { 
    dragEnabled: true,
    dragStartPredicate: {
      handle: '.handle'
    }
  }),

  list: select('#grid'),

  input: select('#add-item'),

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
    const item = select(`.item[data-id="${id}"]`)

    this.removeEventListenersFromTodoItem(item)
    this.grid.remove(item, { removeElements: true })
  },

  updateItemName(id, newName) {
    select(`.todo-content[data-id="${id}"]`, this.list).innerHTML = newName
  },

  updateItemStyling(item, isCompleted) {
    const content = select('.todo-content', item)
    
    isCompleted ? content.classList.add('completed') : content.classList.remove('completed')
  },

  updateItemIndices() {
    const items = this.grid.getItems()
    
    items.forEach((item, i) => item.getElement().dataset.index = i)
  },

  selectItemElements(item) {
    return {
      toggle: select('input[type="checkbox"]', item),
      todoContent: select('.todo-content', item),
      deleteButton: select('.del-btn', item),
      editInput: select('.edit', item)
    }
  },

  // Event Handlers

  handleInputKeydown(e) {
    if (e.key === 'Enter') {
      const name = e.target.value.trim()
      const sanitizedName = sanitize(name)
      
      if (sanitizedName !== '') {
        controller.addTodo(sanitizedName, false)
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
    const id = listItem.dataset.id
    const editInput = select('.edit', listItem)

    editInput.classList.remove('hidden')
    editInput.value = select(`.todo-content[data-id="${id}"]`).innerHTML
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
      const sanitizedNewName = sanitize(newName)

      if (newName !== '') {
        controller.updateTodoName(id, sanitizedNewName)
        view.updateItemName(id, sanitizedNewName)
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
    const { toggle, todoContent, deleteButton, editInput } = this.selectItemElements(item)

    toggle.addEventListener('click', this.handleToggleClick)
    todoContent.addEventListener('dblclick', this.handleTodoContentDoubleClick)
    deleteButton.addEventListener('click', this.handleDeleteButtonClick) 
    editInput.addEventListener('blur', this.handleEditInputBlur)
    editInput.addEventListener('keyup', this.handleEditInputKeyup)
  },

  removeEventListenersFromTodoItem(item) {
    const { toggle, todoContent, deleteButton, editInput } = this.selectItemElements(item)

    toggle.removeEventListener('click', this.handleToggleClick)
    todoContent.removeEventListener('dblclick', this.handleTodoContentDoubleClick)
    deleteButton.removeEventListener('click', this.handleDeleteButtonClick)
    editInput.removeEventListener('blur', this.handleEditInputBlur)
    editInput.removeEventListener('keyup', this.handleEditInputKeyup)
  }
}