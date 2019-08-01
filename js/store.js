const store = {
  get() {
    return JSON.parse(localStorage.getItem('to-do-app-js-list')) || []
  },

  set(todos) {
    localStorage.setItem('to-do-app-js-list', JSON.stringify(todos))
  }
}