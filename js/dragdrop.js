/**
 * Drag and Drop Module
 * Handles all drag-and-drop functionality
 */

import { state } from './state.js';
import { render } from './ui.js';

// Drag state
let draggedItem = null;
let draggedType = null; // 'group' or 'task'
let draggedGroupId = null;

/**
 * Setup drag events for a group element
 */
export function setupGroupDragEvents(groupEl) {
  const handle = groupEl.querySelector('.group-header .drag-handle');
  
  // Only enable dragging when clicking the handle
  if (handle) {
    handle.addEventListener('mousedown', (e) => {
      groupEl.draggable = true;
    });
    
    // Disable dragging when mouse is released
    handle.addEventListener('mouseup', () => {
      groupEl.draggable = false;
    });
  }

  groupEl.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('task')) return;
    draggedItem = groupEl;
    draggedType = 'group';
    setTimeout(() => groupEl.classList.add('dragging'), 0);
  });

  groupEl.addEventListener('dragend', () => {
    groupEl.classList.remove('dragging');
    groupEl.draggable = false; // Reset draggable
    draggedItem = null;
    draggedType = null;
  });

  groupEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (draggedType === 'group' && draggedItem !== groupEl) {
      groupEl.classList.add('drag-over');
    }
  });

  groupEl.addEventListener('dragleave', () => {
    groupEl.classList.remove('drag-over');
  });

  groupEl.addEventListener('drop', (e) => {
    e.preventDefault();
    groupEl.classList.remove('drag-over');
    
    if (draggedType === 'group' && draggedItem !== groupEl) {
      const fromId = parseInt(draggedItem.dataset.groupId);
      const toId = parseInt(groupEl.dataset.groupId);
      
      const fromIndex = state.groups.findIndex(g => g.id === fromId);
      const toIndex = state.groups.findIndex(g => g.id === toId);
      
      if (fromIndex !== -1 && toIndex !== -1) {
        const [moved] = state.groups.splice(fromIndex, 1);
        state.groups.splice(toIndex, 0, moved);
        render();
      }
    }
  });

  // Setup task drag events for this group's tasks container
  const tasksContainer = groupEl.querySelector('.tasks-container');
  if (tasksContainer) {
    setupTaskDragEvents(tasksContainer);
  }
}

/**
 * Setup drag events for tasks within a container
 */
export function setupTaskDragEvents(container) {
  // Setup drag handle for tasks - delegate to handle click
  container.addEventListener('mousedown', (e) => {
    const handle = e.target.closest('.task .drag-handle');
    if (handle) {
      const task = handle.closest('.task');
      if (task) task.draggable = true;
    }
  });
  
  container.addEventListener('mouseup', (e) => {
    const task = e.target.closest('.task');
    if (task) task.draggable = false;
  });

  container.addEventListener('dragstart', (e) => {
    if (!e.target.classList.contains('task')) return;
    draggedItem = e.target;
    draggedType = 'task';
    draggedGroupId = e.target.dataset.groupId;
    setTimeout(() => e.target.classList.add('dragging'), 0);
    e.stopPropagation();
  });

  container.addEventListener('dragend', (e) => {
    if (!e.target.classList.contains('task')) return;
    e.target.classList.remove('dragging');
    e.target.draggable = false; // Reset draggable
    draggedItem = null;
    draggedType = null;
    draggedGroupId = null;
    document.querySelectorAll('.task.drag-over').forEach(t => t.classList.remove('drag-over'));
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (draggedType !== 'task') return;

    const afterElement = getDragAfterElement(container, e.clientY);
    const tasks = container.querySelectorAll('.task:not(.dragging)');
    tasks.forEach(t => t.classList.remove('drag-over'));
    
    if (afterElement) {
      afterElement.classList.add('drag-over');
    }
  });

  container.addEventListener('dragleave', (e) => {
    if (e.target.classList.contains('task')) {
      e.target.classList.remove('drag-over');
    }
  });

  container.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedType !== 'task') return;

    const targetGroupId = parseInt(container.dataset.groupId);
    const taskId = parseInt(draggedItem.dataset.taskId);
    const sourceGroupId = parseInt(draggedGroupId);

    // Find and remove task from source group
    const sourceGroup = state.groups.find(g => g.id === sourceGroupId);
    if (!sourceGroup) return;
    
    const taskIdx = sourceGroup.tasks.findIndex(t => t.id === taskId);
    if (taskIdx === -1) return;
    
    const [task] = sourceGroup.tasks.splice(taskIdx, 1);

    // Find target group and insert position
    const targetGroup = state.groups.find(g => g.id === targetGroupId);
    if (!targetGroup) return;

    const afterElement = getDragAfterElement(container, e.clientY);
    
    if (afterElement) {
      const insertIndex = targetGroup.tasks.findIndex(t => t.id === parseInt(afterElement.dataset.taskId));
      targetGroup.tasks.splice(insertIndex, 0, task);
    } else {
      targetGroup.tasks.push(task);
    }

    render();
  });
}

/**
 * Get the element to insert after based on cursor position
 */
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];
  
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
