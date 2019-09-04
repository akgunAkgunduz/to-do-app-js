import { select } from '../utils/helpers'
import { createTodoItemContent } from '../templates/todoItem'

export default class View {
  constructor(grid, list, input) {
    this.grid = grid
    this.list = list
    this.input = input
  }

  addItemToGrid({ id, name, completed }, handlers) {
    const itemDiv = document.createElement('div')
    const itemContentDiv = createTodoItemContent(id, name, completed)

    itemDiv.classList.add('item')
    itemDiv.dataset.id = id
    itemDiv.innerHTML = itemContentDiv

    this.updateItemStyling(itemDiv, completed)
    this.addEventListenersForTodoItem(itemDiv, handlers)
    this.grid.add(itemDiv)
  }

  removeItemFromGrid(id, handlers) {
    const item = select(`.item[data-id="${id}"]`)

    this.removeEventListenersFromTodoItem(item, handlers)
    this.grid.remove(item, { removeElements: true })
  }

  updateItemName(id, newName) {
    select(`.todo-content[data-id="${id}"]`, this.list).innerHTML = newName
  }

  updateItemStyling(item, isCompleted) {
    const content = select('.todo-content', item)
    
    isCompleted ? content.classList.add('completed') : content.classList.remove('completed')
  }

  updateItemIndices() {
    const items = this.grid.getItems()
    
    items.forEach((item, i) => item.getElement().dataset.index = i)
  }

  selectItemElements(item) {
    return {
      toggle: select('input[type="checkbox"]', item),
      todoContent: select('.todo-content', item),
      deleteButton: select('.del-btn', item),
      editInput: select('.edit', item)
    }
  }

  addEventListenersForTodoItem(item, handlers) {
    const { toggle, todoContent, deleteButton, editInput } = this.selectItemElements(item)

    toggle.addEventListener('click', handlers.handleToggleClick)
    todoContent.addEventListener('dblclick', handlers.handleTodoContentDoubleClick)
    deleteButton.addEventListener('click', handlers.handleDeleteButtonClick) 
    editInput.addEventListener('blur', handlers.handleEditInputBlur)
    editInput.addEventListener('keyup', handlers.handleEditInputKeyup)
  }

  removeEventListenersFromTodoItem(item, handlers) {
    const { toggle, todoContent, deleteButton, editInput } = this.selectItemElements(item)

    toggle.removeEventListener('click', handlers.handleToggleClick)
    todoContent.removeEventListener('dblclick', handlers.handleTodoContentDoubleClick)
    deleteButton.removeEventListener('click', handlers.handleDeleteButtonClick)
    editInput.removeEventListener('blur', handlers.handleEditInputBlur)
    editInput.removeEventListener('keyup', handlers.handleEditInputKeyup)
  }
}