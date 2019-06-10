let store = {
  get() {
    const todos = JSON.parse(localStorage.getItem('to-do-app-js-list')) || []
    return todos
  },

  set(todos) {
    localStorage.setItem('to-do-app-js-list', JSON.stringify(todos))
  }
}