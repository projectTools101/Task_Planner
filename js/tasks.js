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
 * Add a task to a group or ungrouped list
 */
export function addTaskToGroup(groupId) {
  if (groupId === 'ungrouped') {
    state.ungroupedTasks.push(createTask());
  } else {
    const group = state.groups.find(g => g.id === groupId);
    if (group) group.tasks.push(createTask());
  }
  render();
  saveToStorage();
}

/**
 * Add an ungrouped task
 */
export function addUngroupedTask() {
  state.ungroupedTasks.push(createTask());
  render();
  saveToStorage();
  
  // Focus the new task's name input
  setTimeout(() => {
    const ungroupedSection = document.querySelector('.group[data-group-id="ungrouped"]');
    if (ungroupedSection) {
      const inputs = ungroupedSection.querySelectorAll('.task-name-input');
      if (inputs.length) inputs[inputs.length - 1].focus();
    }
  }, 50);
}

/**
 * Update a task's field
 */
export function updateTask(groupId, taskId, field, value) {
  let task;
  if (groupId === 'ungrouped') {
    task = state.ungroupedTasks.find(t => t.id === taskId);
  } else {
    const group = state.groups.find(g => g.id === groupId);
    if (group) task = group.tasks.find(t => t.id === taskId);
  }
  
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

/**
 * Delete a task
 */
export function deleteTask(groupId, taskId) {
  if (groupId === 'ungrouped') {
    state.ungroupedTasks = state.ungroupedTasks.filter(t => t.id !== taskId);
  } else {
    const group = state.groups.find(g => g.id === groupId);
    if (group) {
      group.tasks = group.tasks.filter(t => t.id !== taskId);
    }
  }
  render();
  saveToStorage();
}
