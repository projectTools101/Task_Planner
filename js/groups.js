/**
 * Group Management Module
 * Handles group CRUD operations
 */

import { state, saveToStorage } from './state.js';
import { render } from './ui.js';
import { createTask } from './tasks.js';

/**
 * Create a new group object
 */
export function createGroup(title = '', withTask = false) {
  const group = {
    id: ++state.groupIdCounter,
    title,
    mode: 'heading', // 'prefix' or 'heading'
    tasks: []
  };
  
  // Optionally add a starter task
  if (withTask) {
    group.tasks.push(createTask());
  }
  
  return group;
}

/**
 * Add a new empty group
 */
export function addGroup() {
  state.groups.push(createGroup());
  render();
  saveToStorage();
  
  // Focus the new group's title input
  setTimeout(() => {
    const inputs = document.querySelectorAll('.group-title-input');
    if (inputs.length) inputs[inputs.length - 1].focus();
  }, 50);
}

/**
 * Add a new group with one task (for "Add Task" button at top level)
 */
export function addTaskAsGroup() {
  state.groups.push(createGroup('', true));
  render();
  saveToStorage();
  
  // Focus the new task's name input
  setTimeout(() => {
    const groups = document.querySelectorAll('.group');
    if (groups.length) {
      const lastGroup = groups[groups.length - 1];
      const taskInput = lastGroup.querySelector('.task-name-input');
      if (taskInput) taskInput.focus();
    }
  }, 50);
}

/**
 * Update a group's title
 */
export function updateGroupTitle(groupId, title) {
  const group = state.groups.find(g => g.id === groupId);
  if (group) {
    group.title = title;
    saveToStorage();
  }
}

/**
 * Update a group's mode (prefix/heading)
 */
export function updateGroupMode(groupId, mode) {
  const group = state.groups.find(g => g.id === groupId);
  if (group) {
    group.mode = mode;
    saveToStorage();
  }
}

/**
 * Delete a group and all its tasks
 */
export function deleteGroup(groupId) {
  state.groups = state.groups.filter(g => g.id !== groupId);
  render();
  saveToStorage();
}

/**
 * Get total hours for a group
 */
export function getGroupHours(groupId) {
  const group = state.groups.find(g => g.id === groupId);
  return group ? group.tasks.reduce((sum, t) => sum + t.hours, 0) : 0;
}
