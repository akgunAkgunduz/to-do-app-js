export default class Store {
  get todoList() {
    return JSON.parse(localStorage.getItem('to-do-app-js-list')) || []
  }

  set todoList(todos) {
    localStorage.setItem('to-do-app-js-list', JSON.stringify(todos))
  }
}