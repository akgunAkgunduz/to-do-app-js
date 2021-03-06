import Muuri from 'muuri'
import Store from './store'
import TodoList from './todoList'
import View from './view'
import { select, sanitize } from '../utils/helpers'

const input = select('#add-item')
const list = select('#grid')

const grid = new Muuri('#grid', { 
  dragEnabled: true,
  dragStartPredicate: {
    handle: '.handle'
  }
})

const store = new Store()
const todoList = new TodoList(store.todoList)
const view = new View(input, list, grid)

export default class Controller {
  constructor() {
    this.handleInputKeydown = this.handleInputKeydown.bind(this)
    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this)
  }

  get todoItemHandlers() {
    return {
      handleToggleClick: this.handleToggleClick,
      handleTodoContentDoubleClick: this.handleTodoContentDoubleClick,
      handleDeleteButtonClick: this.handleDeleteButtonClick,
      handleEditInputBlur: this.handleEditInputBlur,
      handleEditInputKeyup: this.handleEditInputKeyup
    }
  }

  initTodoList() {
    const handlers = this.todoItemHandlers

    todoList.todos.forEach(todo => {
      view.addItemToGrid(todo, handlers)
    })

    view.updateItemIndices()
  }

  handleInputKeydown(e) {
    if (e.key === 'Enter') {
      const name = e.target.value.trim()
      const sanitizedName = sanitize(name)
      
      if (sanitizedName !== '') {
        const todo = todoList.addItem(sanitizedName, false)
        
        store.todoList = todoList.todos

        e.target.value = ''

        const handlers = this.todoItemHandlers

        view.addItemToGrid(todo, handlers)
        view.updateItemIndices()
      }
    }
  }

  handleGridDragReleaseEnd(item) {
    const indices = []

    const grid = item.getGrid()
    const items = grid.getItems()

    items.forEach(item => indices.push(item.getElement().dataset.index))

    todoList.reorderItems(indices)

    store.todoList = todoList.todos

    view.updateItemIndices()
  }

  handleToggleClick(e) {
    const listItem = e.target.closest('.item')
    const id = parseInt(listItem.dataset.id)

    const isCompleted = todoList.toggleItemStatus(id)

    store.todoList = todoList.todos
    
    view.updateItemStyling(listItem, isCompleted)
  }

  handleTodoContentDoubleClick(e) {
    const listItem = e.target.closest('.item')
    const id = listItem.dataset.id
    const editInput = select('.edit', listItem)

    editInput.classList.remove('hidden')
    editInput.value = select(`.todo-content[data-id="${id}"]`).innerHTML
    editInput.focus()
  }

  handleDeleteButtonClick(e) {
    const id = parseInt(e.target.closest('.item').dataset.id)

    todoList.removeItem(id)

    store.todoList = todoList.todos

    const handlers = this.todoItemHandlers

    view.removeItemFromGrid(id, handlers)
    view.updateItemIndices()
  }

  handleEditInputBlur(e) {
    e.target.classList.add('hidden')
  }

  handleEditInputKeyup(e) {
    if (e.key === 'Enter') {
      const id = parseInt(e.target.dataset.id)
      const newName = e.target.value.trim()
      const sanitizedNewName = sanitize(newName)

      if (newName !== '') {
        todoList.updateItemName(id, sanitizedNewName)

        store.todoList = todoList.todos

        view.updateItemName(id, sanitizedNewName)

        e.target.blur()
      }
    }

    if (e.key === 'Escape') {
      e.target.blur()
    }
  }

  setUpEventListeners() {
    view.input.addEventListener('keydown', this.handleInputKeydown)
    view.grid.on('dragReleaseEnd', this.handleGridDragReleaseEnd)
  }
}