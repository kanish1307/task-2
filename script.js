document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoDate = document.getElementById('todo-date');
    const todoPriority = document.getElementById('todo-priority');
    const todoList = document.getElementById('todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const progress = document.querySelector('.progress');
  
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
  
    todoForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const newTodo = {
        task: todoInput.value,
        date: todoDate.value,
        priority: todoPriority.value,
        completed: false
      };
      todos.push(newTodo);
      saveAndRenderTodos();
      todoInput.value = '';
      todoDate.value = '';
      todoPriority.value = 'low';
    });
  
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        renderTodos(filter);
      });
    });
  
    function saveAndRenderTodos() {
      localStorage.setItem('todos', JSON.stringify(todos));
      renderTodos();
    }
  
    function renderTodos(filter = 'all') {
      todoList.innerHTML = '';
      const filteredTodos = todos.filter(todo => {
        if (filter === 'completed') return todo.completed;
        if (filter === 'pending') return !todo.completed;
        return true;
      });
      filteredTodos.forEach((todo, index) => {
        const todoItem = document.createElement('li');
        todoItem.classList.add(todo.priority);
        if (todo.completed) todoItem.classList.add('completed');
        todoItem.innerHTML = `
          <span>${todo.task} <small>${todo.date}</small></span>
          <div class="buttons">
            <button class="complete-btn" data-index="${index}">Complete</button>
            <button class="edit-btn" data-index="${index}">Edit</button>
            <button class="delete-btn" data-index="${index}">Delete</button>
          </div>
        `;
        todoList.appendChild(todoItem);
  
        const completeBtn = todoItem.querySelector('.complete-btn');
        const editBtn = todoItem.querySelector('.edit-btn');
        const deleteBtn = todoItem.querySelector('.delete-btn');
  
        completeBtn.addEventListener('click', () => {
          todos[index].completed = !todos[index].completed;
          saveAndRenderTodos();
        });
  
        editBtn.addEventListener('click', () => {
          const newTask = prompt('Edit your task:', todos[index].task);
          if (newTask) {
            todos[index].task = newTask;
          }
          const newDate = prompt('Edit your due date:', todos[index].date);
          if (newDate) {
            todos[index].date = newDate;
          }
          saveAndRenderTodos();
        });
  
        deleteBtn.addEventListener('click', () => {
          todos.splice(index, 1);
          saveAndRenderTodos();
        });
      });
      updateProgress();
    }
  
    function updateProgress() {
      const total = todos.length;
      const completed = todos.filter(todo => todo.completed).length;
      const percentage = total === 0 ? 0 : (completed / total) * 100;
      progress.style.width = `${percentage}%`;
    }
  
    renderTodos();
  });
  