import Controller from './classes/controller'

window.addEventListener('DOMContentLoaded', () => {
  const controller = new Controller()

  controller.initTodoList()
  controller.setUpEventListeners()
})
