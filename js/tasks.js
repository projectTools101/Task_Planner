/**
 * Task Management Module
 * Handles task CRUD operations
 */

import { state, saveToStorage } from './state.js';
import { render, updateProgress } from './ui.js';

/**
 * Create a new task object
 */
export function createTask(name = '', hours = 0) {
  return {
    id: ++state.taskIdCounter,
    name,
    hours: parseFloat(hours) || 0
  };
}

/**
 * Add a task to a specific group
 */
export function addTaskToGroup(groupId) {
  const numericGroupId = parseInt(groupId, 10);
  const group = state.groups.find(g => g.id === numericGroupId);
  if (group) {
    group.tasks.push(createTask());
    render();
    saveToStorage();
    
    // Focus the new task's name input
    setTimeout(() => {
      const groupEl = document.querySelector(`.group[data-group-id="${groupId}"]`);
      if (groupEl) {
        const inputs = groupEl.querySelectorAll('.task-name-input');
        if (inputs.length) inputs[inputs.length - 1].focus();
      }
    }, 50);
  }
}

/**
 * Update a task's field
 */
export function updateTask(groupId, taskId, field, value) {
  const numericGroupId = parseInt(groupId, 10);
  const group = state.groups.find(g => g.id === numericGroupId);
  if (group) {
    const task = group.tasks.find(t => t.id === taskId);
    if (task) {
      if (field === 'hours') {
        task[field] = parseFloat(value) || 0;
        updateProgress();
      } else {
        task[field] = value;
      }
      saveToStorage();
    }
  }
}

/**
 * Delete a task from a group
 */
export function deleteTask(groupId, taskId) {
  const numericGroupId = parseInt(groupId, 10);
  const group = state.groups.find(g => g.id === numericGroupId);
  if (group) {
    group.tasks = group.tasks.filter(t => t.id !== taskId);
    render();
    saveToStorage();
  }
}
