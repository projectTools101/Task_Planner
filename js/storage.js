/**
 * Storage Module
 * Handles localStorage persistence for tasks and groups
 */

const STORAGE_KEY = 'taskPlannerData';

/**
 * Save state to localStorage
 */
export function saveState(state) {
  const data = {
    groups: state.groups,
    groupIdCounter: state.groupIdCounter,
    taskIdCounter: state.taskIdCounter,
    totalHours: document.getElementById('totalHours')?.value || 40
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Load state from localStorage
 * Returns null if no saved state exists
 */
export function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse saved state:', e);
    return null;
  }
}

/**
 * Clear saved state from localStorage
 */
export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Check if persist is enabled
 */
export function isPersistEnabled() {
  return localStorage.getItem('taskPlannerPersist') === 'true';
}

/**
 * Set persist preference
 */
export function setPersistEnabled(enabled) {
  localStorage.setItem('taskPlannerPersist', enabled ? 'true' : 'false');
}
