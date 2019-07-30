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
    const itemContentDiv = document.createElement('div')

    const handleContainer = document.createElement('div')
    const handle = document.createElement('div')
    const handleIcon = document.createElement('i')

    const toggle = document.createElement('div')
    const toggleLabel = document.createElement('label')
    const toggleCheckbox = document.createElement('input')
    const toggleDiv = document.createElement('div')

    const todoContentDiv = document.createElement('div')

    const editInput = document.createElement('input')

    const deleteButtonContainer = document.createElement('div')
    const deleteButton = document.createElement('button')
    const deleteButtonIcon = document.createElement('i')

    itemDiv.classList.add('item')
    itemDiv.dataset.id = id

    itemContentDiv.classList.add('item-content')
    itemContentDiv.dataset.id = id

    handle.className = 'handle hidden'

    handleIcon.className = 'fas fa-grip-vertical'

    toggle.className = 'toggle'
    toggle.dataset.id = id

    toggleCheckbox.type = 'checkbox'
    toggleCheckbox.dataset.id = id
    toggleCheckbox.checked = completed ? true : false

    toggleDiv.className = 'check-mark'
    toggleDiv.dataset.id = id    

    todoContentDiv.className = 'todo-content'
    todoContentDiv.innerText = name
    todoContentDiv.dataset.id = id

    editInput.type = 'text'
    editInput.className = 'edit hidden'
    editInput.dataset.id = id

    deleteButton.className = 'del-btn hidden'
    deleteButtonIcon.className = 'fas fa-trash'
    deleteButton.dataset.id = id

    handle.appendChild(handleIcon)
    handleContainer.appendChild(handle)

    toggleLabel.appendChild(toggleCheckbox)
    toggleLabel.appendChild(toggleDiv)
    toggle.appendChild(toggleLabel)

    deleteButton.appendChild(deleteButtonIcon)
    deleteButtonContainer.appendChild(deleteButton)
    
    itemContentDiv.appendChild(handleContainer)
    itemContentDiv.appendChild(toggle)
    itemContentDiv.appendChild(todoContentDiv)
    itemContentDiv.appendChild(editInput)
    itemContentDiv.appendChild(deleteButtonContainer)
    
    itemDiv.appendChild(itemContentDiv)
    
    this.updateItemStyling(itemDiv, completed)

    toggleDiv.addEventListener('click', this.handleToggleClick)
    this.addEventListenersForEditInput(editInput)
    deleteButton.addEventListener('click', this.handleDeleteButtonClick)

    this.grid.add(itemDiv)
  },

  removeItemFromGrid(id) {
    const item = document.querySelector(`.item[data-id="${id}"]`)
    const deleteButton = item.querySelector('.del-btn')
    const toggleDiv = item.querySelector('.check-mark')

    deleteButton.removeEventListener('click', this.handleDeleteButtonClick)
    toggleDiv.removeEventListener('click', this.handleToggleClick)

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

  handleToggleClick(e) {
    const listItem = e.target.closest('.item')
    const id = parseInt(listItem.dataset.id)

    controller.toggleTodoStatus(id, listItem)
  },

  handleDeleteButtonClick(e) {
    const id = parseInt(e.target.closest('.item').dataset.id)
    
    controller.removeTodo(id)
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
      const indices = []

      const grid = item.getGrid()
      const items = grid.getItems()

      items.forEach(item => indices.push(item.getElement().dataset.index))

      controller.reorderTodos(indices)
    })

    this.list.addEventListener('dblclick', (e) => {
      if (e.target.matches('.todo-content')) {
        const id = parseInt(e.target.dataset.id)
        const editInput = document.querySelector(`.edit[data-id="${id}"]`)

        editInput.classList.remove('hidden')
        editInput.value = e.target.innerText
        editInput.focus()
      }
    })
  },

  addEventListenersForEditInput(input) {    
    input.addEventListener('blur', (e) => {
      e.target.classList.add('hidden')
    })

    input.addEventListener('keyup', (e) => {
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
    })    
  }
}