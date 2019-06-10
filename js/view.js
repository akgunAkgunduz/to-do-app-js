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

    const handle = document.createElement('div')
    handle.classList.add('handle')
    handle.classList.add('invisible')
    const handleIcon = document.createElement('i')
    handleIcon.classList.add('fas')
    handleIcon.classList.add('fa-grip-vertical')
    handle.appendChild(handleIcon)

    const toggle = document.createElement('div')
    toggle.classList.add('toggle')
    toggle.dataset.id = id
    const toggleLabel = document.createElement('label')
    const toggleCheckbox = document.createElement('input')
    toggleCheckbox.type = 'checkbox'
    toggleCheckbox.dataset.id = id
    toggleCheckbox.checked = completed ? true : false
    const toggleDiv = document.createElement('div')
    toggleDiv.classList.add('check-mark')
    toggleDiv.dataset.id = id

    toggleLabel.appendChild(toggleCheckbox)
    toggleLabel.appendChild(toggleDiv)
    toggle.appendChild(toggleLabel)

    const todoContentDiv = document.createElement('div')
    todoContentDiv.classList.add('todo-content')
    todoContentDiv.innerText = name
    todoContentDiv.dataset.id = id

    const deleteButton = document.createElement('div')
    deleteButton.classList.add('del-btn')
    deleteButton.classList.add('fas')
    deleteButton.classList.add('fa-trash')
    deleteButton.classList.add('invisible')
    deleteButton.dataset.id = id
    
    itemContentDiv.appendChild(handle)
    itemContentDiv.appendChild(toggle)
    itemContentDiv.appendChild(todoContentDiv)
    itemContentDiv.appendChild(deleteButton)
    itemDiv.appendChild(itemContentDiv)

    this.updateItemStyling(itemDiv, completed)
    this.addEventListenersForItem(itemDiv)

    this.grid.add(itemDiv)
  },

  removeItem(id) {
    const item = document.querySelector(`.item[data-id="${id}"]`)

    this.grid.remove(item, { removeElements: true })
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
  },

  addEventListenersForItem(item) {
    item.addEventListener('mouseenter', (e) => {
      const handle = e.target.querySelector('.handle')
      const deleteButton = e.target.querySelector('.del-btn')

      handle.classList.remove('invisible')
      deleteButton.classList.remove('invisible')
    })

    item.addEventListener('mouseleave', (e) => {
      const handle = e.target.querySelector('.handle')
      const deleteButton = e.target.querySelector('.del-btn')

      handle.classList.add('invisible')
      deleteButton.classList.add('invisible')
    })
  }
}