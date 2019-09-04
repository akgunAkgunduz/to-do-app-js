export const createTodoItemContent = (id, name, completed) => {
  return (
    `<div class="item-content">
      <div>
        <div class="handle hidden">
          <i class="fas fa-grip-vertical"></i>
        </div>
      </div>

      <div class="toggle" data-id="${id}">
        <label>
          <input type="checkbox" data-id="${id}" ${completed ? 'checked' : ''}>
          <div class="check-mark" data-id="${id}"></div>
        </label>
      </div>

      <div class="todo-content" data-id="${id}">${name}</div>
      
      <input type="text" class="edit hidden" data-id="${id}">
      
      <div>
        <button class="del-btn hidden" data-id="${id}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>`
  )
}