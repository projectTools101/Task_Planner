/**
 * Group Management Module
 * Handles group CRUD operations
 */

import { state, saveToStorage } from './state.js';
import { render } from './ui.js';

/**
 * Create a new group object
 */
export function createGroup(title = '') {
  return {
    id: ++state.groupIdCounter,
    title,
    mode: 'heading', // 'prefix' or 'heading'
    tasks: []
  };
}

/**
 * Add a new group
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
 * Delete a group (moves tasks to ungrouped)
 */
export function deleteGroup(groupId) {
  const groupIndex = state.groups.findIndex(g => g.id === groupId);
  if (groupIndex !== -1) {
    // Move tasks to ungrouped
    state.ungroupedTasks.push(...state.groups[groupIndex].tasks);
    state.groups.splice(groupIndex, 1);
    render();
    saveToStorage();
  }
}

/**
 * Get total hours for a group
 */
export function getGroupHours(groupId) {
  if (groupId === 'ungrouped') {
    return state.ungroupedTasks.reduce((sum, t) => sum + t.hours, 0);
  }
  const group = state.groups.find(g => g.id === groupId);
  return group ? group.tasks.reduce((sum, t) => sum + t.hours, 0) : 0;
}
