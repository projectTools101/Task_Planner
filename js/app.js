/**
 * Task Planner - Main Application Entry Point
 * Initializes the application and exposes global API
 */

import { render, updateProgress, autoResize } from './ui.js';
import { addGroup, addTaskAsGroup, updateGroupTitle, updateGroupMode, deleteGroup } from './groups.js';
import { addTaskToGroup, updateTask, deleteTask, adjustHours } from './tasks.js';
import { copyAsText } from './export.js';

/**
 * Initialize the application
 */
function init() {
  
  // Setup event listeners
  document.getElementById('totalHours').addEventListener('input', updateProgress);
  
  // Initial render
  render();
}

// Expose API globally for inline event handlers
window.taskPlanner = {
  addGroup,
  addTaskAsGroup,
  updateGroupTitle,
  updateGroupMode,
  deleteGroup,
  addTaskToGroup,
  updateTask,
  deleteTask,
  adjustHours,
  copyAsText,
  autoResize
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
