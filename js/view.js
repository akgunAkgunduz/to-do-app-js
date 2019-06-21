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

    const handle = document.createElement('div')
    const handleIcon = document.createElement('i')

    const toggle = document.createElement('div')
    const toggleLabel = document.createElement('label')
    const toggleCheckbox = document.createElement('input')
    const toggleDiv = document.createElement('div')

    const todoContentDiv = document.createElement('div')

    const editInput = document.createElement('input')

    const deleteButton = document.createElement('div')

    itemDiv.classList.add('item')
    itemDiv.dataset.id = id

    itemContentDiv.classList.add('item-content')
    itemContentDiv.dataset.id = id

    handle.className = 'handle invisible'

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

    deleteButton.className = 'del-btn hidden fas fa-trash'
    deleteButton.dataset.id = id

    handle.appendChild(handleIcon)

    toggleLabel.appendChild(toggleCheckbox)
    toggleLabel.appendChild(toggleDiv)
    toggle.appendChild(toggleLabel)
    
    itemContentDiv.appendChild(handle)
    itemContentDiv.appendChild(toggle)
    itemContentDiv.appendChild(todoContentDiv)
    itemContentDiv.appendChild(editInput)
    itemContentDiv.appendChild(deleteButton)
    
    itemDiv.appendChild(itemContentDiv)
    
    this.updateItemStyling(itemDiv, completed)

    this.addEventListenersForEditInput(editInput)
    this.addEventListenersForItem(itemDiv)

    this.grid.add(itemDiv)
  },

  removeItemFromGrid(id) {
    const item = document.querySelector(`.item[data-id="${id}"]`)

    this.grid.remove(item, { removeElements: true })
  },

  updateItemName(id, newName) {
    this.list.querySelector(`.todo-content[data-id="${id}"]`).innerText = newName
  },

  updateItemStyling(item, isCompleted) {
    const content = item.querySelector('.todo-content')
    if (isCompleted) {
      content.classList.add('completed')
    } else {
      content.classList.remove('completed')
    }
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
      const indices = []

      const grid = item.getGrid()
      const items = grid.getItems()

      items.forEach(item => indices.push(item.getElement().dataset.index))

      controller.reorderTodos(indices)
    })

    this.list.addEventListener('click', (e) => {
      if (e.target.matches('.check-mark')) {
        const id = parseInt(e.target.dataset.id)
        const listItem = e.target.parentNode.parentNode.parentNode.parentNode
        
        controller.toggleTodoStatus(id, listItem)
      }

      if (e.target.matches('.del-btn')) {
        const id = parseInt(e.target.dataset.id)

        controller.removeTodo(id)
      }
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

  addEventListenersForItem(item) {
    item.addEventListener('mouseenter', (e) => {
      const handle = e.target.querySelector('.handle')
      const deleteButton = e.target.querySelector('.del-btn')

      handle.classList.remove('invisible')
      deleteButton.classList.remove('hidden')
    })

    item.addEventListener('mouseleave', (e) => {
      const handle = e.target.querySelector('.handle')
      const deleteButton = e.target.querySelector('.del-btn')

      handle.classList.add('invisible')
      deleteButton.classList.add('hidden')
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