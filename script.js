document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearBtn = document.getElementById('clear-btn');
    const darkToggle = document.getElementById('dark-toggle');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    function renderTasks() {
        todoList.innerHTML = '';
        tasks.forEach((task, index) => {
            if(currentFilter === 'done' && !task.completed) return;
            if(currentFilter === 'pending' && task.completed) return;

            const li = document.createElement('li');
            li.className = 'todo-item';
            li.innerHTML = `
                <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
                <div class="actions">
                    <button class="toggle-btn">${task.completed ? 'Undo' : 'Done'}</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            li.querySelector('.toggle-btn').addEventListener('click', () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
            });

            li.querySelector('.delete-btn').addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            todoList.appendChild(li);
        });
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    addBtn.addEventListener('click', () => {
        const text = todoInput.value.trim();
        if(text) {
            tasks.push({ text, completed:false });
            todoInput.value = '';
            saveTasks();
            renderTasks();
        }
    });

    todoInput.addEventListener('keypress', e => { if(e.key==='Enter') addBtn.click(); });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    clearBtn.addEventListener('click', () => {
        if(confirm('Clear all tasks?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    });

    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
    });

    renderTasks();
});