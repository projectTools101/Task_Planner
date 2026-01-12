import { state, saveToStorage } from './state.js';
import { getGroupHours } from './groups.js';
import { setupGroupDragEvents } from './dragdrop.js';
import { generateText } from './export.js';

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Get total planned hours across all tasks
 */
export function getTotalPlannedHours() {
  let total = 0;
  state.groups.forEach(g => g.tasks.forEach(t => total += t.hours));
  return total;
}

/**
 * Update the progress bar, text and live preview
 */
export function updateProgress() {
  const total = parseFloat(document.getElementById('totalHours')?.value) || 0;
  const planned = getTotalPlannedHours();
  const remaining = total - planned;
  const percentage = total > 0 ? Math.min((planned / total) * 100, 100) : 0;

  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = percentage + '%';
    progressBar.classList.toggle('over', planned > total);
  }

  const plannedHoursEl = document.getElementById('plannedHours');
  if (plannedHoursEl) {
    plannedHoursEl.textContent = planned.toFixed(1).replace(/\.0$/, '') + 'h planned';
  }
  
  const remainingEl = document.getElementById('remainingHours');
  if (remainingEl) {
    remainingEl.textContent = remaining.toFixed(1).replace(/\.0$/, '') + 'h remaining';
    remainingEl.classList.toggle('over', remaining < 0);
  }

  // Update live preview
  const outputTextEl = document.getElementById('outputText');
  if (outputTextEl) {
    outputTextEl.textContent = generateText();
  }

  saveToStorage();
}

/**
 * Show a toast notification
 */
export function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

/**
 * Render a single task
 */
function renderTask(groupId, task) {
  return `
    <div class="task" data-task-id="${task.id}" data-group-id="${groupId}" draggable="false">
      <span class="drag-handle" title="Drag to reorder">⠿</span>
      <input type="text" class="task-name-input" placeholder="Task name" 
             value="${escapeHtml(task.name)}"
             oninput="window.taskPlanner.updateTask('${groupId}', ${task.id}, 'name', this.value)">
      <div class="task-hours">
        <input type="number" value="${task.hours}" min="0" step="0.5"
               oninput="window.taskPlanner.updateTask('${groupId}', ${task.id}, 'hours', this.value)">
        <span>h</span>
      </div>
      <button class="delete-task-btn" onclick="window.taskPlanner.deleteTask('${groupId}', ${task.id})" title="Delete task">✕</button>
    </div>
  `;
}

/**
 * Render a group
 */
function renderGroup(group) {
  const div = document.createElement('div');
  div.className = 'group';
  div.dataset.groupId = group.id;
  div.draggable = false; // Only drag via handle

  const groupHours = getGroupHours(group.id);

  div.innerHTML = `
    <div class="group-header">
      <span class="drag-handle" title="Drag to reorder">⠿</span>
      <input type="text" class="group-title-input" placeholder="Group title (optional)" 
             value="${escapeHtml(group.title)}" 
             oninput="window.taskPlanner.updateGroupTitle(${group.id}, this.value)">
      <span class="group-hours">${groupHours.toFixed(1).replace(/\.0$/, '')}h</span>
      <div class="group-options">
        <label>
          <input type="radio" name="mode-${group.id}" value="prefix" 
                 ${group.mode === 'prefix' ? 'checked' : ''}
                 onchange="window.taskPlanner.updateGroupMode(${group.id}, 'prefix')">
          Prefix
        </label>
        <label>
          <input type="radio" name="mode-${group.id}" value="heading" 
                 ${group.mode === 'heading' ? 'checked' : ''}
                 onchange="window.taskPlanner.updateGroupMode(${group.id}, 'heading')">
          Heading
        </label>
      </div>
      <button class="delete-group-btn" onclick="window.taskPlanner.deleteGroup(${group.id})" title="Delete group">✕</button>
    </div>
    <div class="tasks-container" data-group-id="${group.id}">
      ${group.tasks.map(task => renderTask(group.id, task)).join('')}
    </div>
    <button class="add-task-btn" onclick="window.taskPlanner.addTaskToGroup(${group.id})">+ Add Task</button>
  `;

  setupGroupDragEvents(div);
  return div;
}

/**
 * Main render function
 */
export function render() {
  const taskList = document.getElementById('taskList');
  
  // Check if empty
  if (state.groups.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <p>No tasks yet. Start by adding a group or a task!</p>
      </div>
    `;
    return;
  }
  
  taskList.innerHTML = '';

  // Render all groups
  state.groups.forEach(group => {
    taskList.appendChild(renderGroup(group));
  });

  updateProgress();
}
