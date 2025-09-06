// ===== PART 1: VARIABLE DECLARATIONS AND CONDITIONALS =====

// DOM element references
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortBtns = document.querySelectorAll('.sort-btn');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const activeTasksEl = document.getElementById('activeTasks');

// Application state variables
let tasks = []; // Array to store task objects
let currentFilter = 'all'; // Current filter for displaying tasks
let currentSort = 'added'; // Current sort method

// Task priorities
const priorities = {
    high: 'High',
    medium: 'Medium',
    low: 'Low'
};

// ===== PART 2: CUSTOM FUNCTIONS =====

/**
 * Function to add a new task to the list
 * @param {string} text - The task description
 * @param {string} priority - The task priority (high, medium, low)
 * @param {boolean} completed - Whether the task is completed
 */
function addTask(text, priority = 'medium', completed = false) {
    // Input validation using conditional
    if (!text || typeof text !== 'string') {
        alert('Please enter a valid task!');
        return;
    }
    
    // Create task object with unique ID
    const task = {
        id: Date.now(), // Using timestamp as simple ID
        text: text.trim(),
        priority: priorities[priority] ? priority : 'medium', // Validate priority
        completed: completed,
        dateAdded: new Date()
    };
    
    // Add to tasks array
    tasks.push(task);
    
    // Update UI
    renderTasks();
    updateStats();
    
    // Clear input
    taskInput.value = '';
    prioritySelect.value = 'medium';
}

/**
 * Function to toggle task completion status
 * @param {number} taskId - The ID of the task to toggle
 */
function toggleTaskCompletion(taskId) {
    // Find task by ID
    const task = tasks.find(task => task.id === taskId);
    
    // If task exists, toggle completion status
    if (task) {
        task.completed = !task.completed;
        
        // Update UI
        renderTasks();
        updateStats();
    }
}

/**
 * Function to sort tasks based on current sort method
 */
function sortTasks() {
    // Using switch statement for different sort methods
    switch(currentSort) {
        case 'priority':
            // Sort by priority (high to low)
            tasks.sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            });
            break;
        case 'added':
            // Sort by date added (newest first)
            tasks.sort((a, b) => b.dateAdded - a.dateAdded);
            break;
        default:
            // Default sort by date added
            tasks.sort((a, b) => b.dateAdded - a.dateAdded);
    }
}

// ===== PART 3: LOOPS =====

/**
 * Function to render tasks based on current filter and sort
 * Demonstrates use of loops to process arrays
 */
function renderTasks() {
    // Clear the task list
    taskList.innerHTML = '';
    
    // Check if there are any tasks
    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="empty-state">No tasks yet. Add a task to get started!</li>';
        return;
    }
    
    // Sort tasks
    sortTasks();
    
    // Filter tasks based on current filter
    let filteredTasks = [];
    
    // Using for...of loop to iterate through tasks
    for (const task of tasks) {
        if (currentFilter === 'all') {
            filteredTasks.push(task);
        } else if (currentFilter === 'active' && !task.completed) {
            filteredTasks.push(task);
        } else if (currentFilter === 'completed' && task.completed) {
            filteredTasks.push(task);
        }
    }
    
    // Check if filtered tasks are empty
    if (filteredTasks.length === 0) {
        let message = '';
        // Using switch statement for different messages
        switch(currentFilter) {
            case 'active':
                message = 'No active tasks!';
                break;
            case 'completed':
                message = 'No completed tasks yet!';
                break;
            default:
                message = 'No tasks found!';
        }
        taskList.innerHTML = `<li class="empty-state">${message}</li>`;
        return;
    }
    
    // Using forEach loop to create task elements
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;
        
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <span class="priority-badge">${task.priority}</span>
            <button class="delete-btn">Delete</button>
        `;
        
        taskList.appendChild(li);
    });
}

/**
 * Function to update task statistics
 * Demonstrates use of loops to calculate values
 */
function updateStats() {
    let total = tasks.length;
    let completed = 0;
    let active = 0;
    
    // Using for loop to count completed and active tasks
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            completed++;
        } else {
            active++;
        }
    }
    
    // Update DOM elements
    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    activeTasksEl.textContent = active;
}

// ===== PART 4: DOM INTERACTIONS =====

// 1. Event listener for adding a new task
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value;
    const priority = prioritySelect.value;
    addTask(taskText, priority);
});

// 2. Event listener for pressing Enter in the input field
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTaskBtn.click();
    }
});

// 3. Event delegation for task list interactions (checking and deleting)
taskList.addEventListener('click', (e) => {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    
    const taskId = parseInt(taskItem.dataset.id);
    
    // Toggle completion when checkbox is clicked
    if (e.target.type === 'checkbox') {
        toggleTaskCompletion(taskId);
    }
    
    // Delete task when delete button is clicked
    if (e.target.classList.contains('delete-btn')) {
        // Using filter to remove task (another type of loop)
        tasks = tasks.filter(task => task.id !== taskId);
        renderTasks();
        updateStats();
    }
});

// 4. Event listeners for filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update current filter and re-render
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// 5. Event listeners for sort buttons
sortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button state
        sortBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update current sort and re-render
        currentSort = btn.dataset.sort;
        renderTasks();
    });
});

// 6. Add some sample tasks on load
window.addEventListener('load', () => {
    addTask('Learn JavaScript fundamentals', 'high');
    addTask('Build a simple project', 'medium');
    addTask('Read about DOM manipulation', 'low');
});