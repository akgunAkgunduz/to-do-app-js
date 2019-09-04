import { select } from '../utils/helpers'
import { createTodoItemContent } from '../templates/todoItem'

export default class View {
  constructor(grid, list, input) {
    this.grid = grid
    this.list = list
    this.input = input
  }

  initList(todos) {
    todos.forEach(todo => {
      this.addItemToGrid(todo)
    })

    this.updateItemIndices()
  }

  addItemToGrid({ id, name, completed }) {
    const itemDiv = document.createElement('div')
    const itemContentDiv = createTodoItemContent(id, name, completed)

    itemDiv.classList.add('item')
    itemDiv.dataset.id = id
    itemDiv.innerHTML = itemContentDiv

    this.updateItemStyling(itemDiv, completed)
    this.addEventListenersForTodoItem(itemDiv)    
    this.grid.add(itemDiv)
  }

  removeItemFromGrid(id) {
    const item = select(`.item[data-id="${id}"]`)

    this.removeEventListenersFromTodoItem(item)
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
}