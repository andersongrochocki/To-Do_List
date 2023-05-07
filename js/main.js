const Main = {

  tasks: [], // array para armazenar as tarefas

  init: function() { // função de inicialização
    this.cacheSelectors() // seleciona os elementos HTML usados na aplicação
    this.bindEvents() // adiciona eventos aos elementos HTML selecionados
    this.getStoraged() // busca as tarefas armazenadas no localStorage
    this.buildTasks() // exibe as tarefas armazenadas no HTML
  },

  cacheSelectors: function() { // seleciona os elementos HTML usados na aplicação
    this.$checkButtons = document.querySelectorAll('.check')
    this.$inputTask = document.querySelector('#inputTask')
    this.$list = document.querySelector('#list')
    this.$removeButtons = document.querySelectorAll('.remove')
  },

  bindEvents: function() { // adiciona eventos aos elementos HTML selecionados
    const self = this

    this.$checkButtons.forEach(function(button){
      button.onclick = self.Events.checkButton_click.bind(self)
    })

    this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)

    this.$removeButtons.forEach(function(button){
      button.onclick = self.Events.removeButton_click.bind(self)
    })
  },

  getStoraged: function() { // busca as tarefas armazenadas no localStorage
    const tasks = localStorage.getItem('tasks')

    if (tasks) {
      this.tasks = JSON.parse(tasks) // converte a string JSON em um array de objetos
    } else {
      localStorage.setItem('tasks', JSON.stringify([])) // se não houver tarefas armazenadas, cria um array vazio no localStorage
    }
  },

  getTaskHtml: function(task, isDone) { // retorna uma string HTML com a marcação de uma tarefa
    return `
      <li class="${isDone ? 'done' : ''}" data-task="${task}">          
        <div class="check" ></div>
        <label class="task">
          ${task}
        </label>
        <button class="remove"></button>
      </li>
    `
  },

  insertHTML: function(element, htmlString) { // insere uma string HTML em um elemento HTML
    element.innerHTML += htmlString

    this.cacheSelectors() // seleciona novamente os elementos HTML usados na aplicação
    this.bindEvents() // adiciona novamente os eventos aos elementos HTML selecionados
  },

  buildTasks: function() { // exibe as tarefas armazenadas no HTML
    let html = ''

    this.tasks.forEach(item => {
      html += this.getTaskHtml(item.task, item.done) // adiciona a marcação HTML de cada tarefa ao html
    })

    this.insertHTML(this.$list, html) // insere o html no elemento HTML da lista de tarefas
  },

  Events: { // objeto que contém os eventos da aplicação
    checkButton_click: function(e) { // evento de clique no botão de check
      const li = e.target.parentElement // seleciona o elemento pai do botão de check
      const value = li.dataset['task'] // pega o valor da tarefa associado ao atributo data-task
      const isDone = li.classList.contains('done') // verifica se a tarefa está marcada como concluída

      const newTasksState = this.tasks.map(item => {
        if (item.task === value) {
          item.done = !isDone
        }

        return item
      })

      localStorage.setItem('tasks', JSON.stringify(newTasksState))

      if (!isDone) {
        return li.classList.add('done')       
      }

      li.classList.remove('done')
    },

    inputTask_keypress: function(e){      
      const key = e.key
      const value = e.target.value
      const isDone = false

      if (key === 'Enter') {
        const taskHtml = this.getTaskHtml(value, isDone)

        this.insertHTML(this.$list, taskHtml)

        e.target.value = ''        

        const savedTasks = localStorage.getItem('tasks')
        const savedTasksArr = JSON.parse(savedTasks)        

        const arrTasks = [
          { task: value, done: isDone },
          ...savedTasksArr,
        ]

        const jsonTasks = JSON.stringify(arrTasks)

        this.tasks = arrTasks
        localStorage.setItem('tasks', jsonTasks)
      }
    },

    removeButton_click: function(e){
      const li = e.target.parentElement
      const value = li.dataset['task']  
      
      console.log(this.tasks)

      const newTasksState = this.tasks.filter(item => {
        console.log(item.task, value)
        return  item.task !== value
      })

      localStorage.setItem('tasks', JSON.stringify(newTasksState))
      this.tasks = newTasksState

      li.classList.add('removed')

      setTimeout(function(){
        li.classList.add('hidden')
      },300)
    }
  }

}

Main.init()

