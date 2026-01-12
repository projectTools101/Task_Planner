/**
 * State Management Module
 * Handles application state and localStorage persistence
 */

// Application State
export const state = {
  groups: [],
  ungroupedTasks: [],
  groupIdCounter: 0,
  taskIdCounter: 0,
};

// Storage key
const STORAGE_KEY = "taskPlanner";

/**
 * Save current state to localStorage
 */
export function saveToStorage() {
  const data = {
    groups: state.groups,
    ungroupedTasks: state.ungroupedTasks,
    totalHours: document.getElementById("totalHours")?.value || 40,
    groupIdCounter: state.groupIdCounter,
    taskIdCounter: state.taskIdCounter,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Load state from localStorage
 */
export function loadFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      state.groups = parsed.groups || [];
      state.ungroupedTasks = parsed.ungroupedTasks || [];
      state.groupIdCounter = parsed.groupIdCounter || 0;
      state.taskIdCounter = parsed.taskIdCounter || 0;

      const totalHoursInput = document.getElementById("totalHours");
      if (totalHoursInput && parsed.totalHours) {
        totalHoursInput.value = parsed.totalHours;
      }
    } catch (e) {
      console.error("Failed to load from storage", e);
    }
  }
}
