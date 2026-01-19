/**
 * Task Planner - Main Application Entry Point
 * Initializes the application and exposes global API
 */

import { render, updateProgress, autoResize } from './ui.js';
import { addGroup, addTaskAsGroup, updateGroupTitle, updateGroupMode, deleteGroup } from './groups.js';
import { addTaskToGroup, updateTask, deleteTask, adjustHours } from './tasks.js';
import { copyAsText } from './export.js';
import { saveState, loadState, isPersistEnabled, setPersistEnabled } from './storage.js';
import { state } from './state.js';

/**
 * Toggle persistence and update UI
 */
function togglePersist(enabled) {
  state.persistEnabled = enabled;
  setPersistEnabled(enabled);
  
  const privacyNote = document.getElementById('privacyNote');
  if (privacyNote) {
    privacyNote.textContent = enabled 
      ? 'Data is saved locally in your browser.' 
      : 'No data is saved to your computer or any server.';
  }
  
  if (enabled) {
    saveState(state);
  }
}

/**
 * Initialize the application
 */
function init() {
  // Check if persist was enabled and restore state
  const persistEnabled = isPersistEnabled();
  state.persistEnabled = persistEnabled;
  
  const persistToggle = document.getElementById('persistToggle');
  if (persistToggle) {
    persistToggle.checked = persistEnabled;
  }
  
  const privacyNote = document.getElementById('privacyNote');
  if (privacyNote && persistEnabled) {
    privacyNote.textContent = 'Data is saved locally in your browser.';
  }
  
  if (persistEnabled) {
    const saved = loadState();
    if (saved) {
      state.groups = saved.groups || [];
      state.groupIdCounter = saved.groupIdCounter || 0;
      state.taskIdCounter = saved.taskIdCounter || 0;
      
      const totalHoursInput = document.getElementById('totalHours');
      if (totalHoursInput && saved.totalHours) {
        totalHoursInput.value = saved.totalHours;
      }
    }
  }
  
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
  autoResize,
  togglePersist
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
