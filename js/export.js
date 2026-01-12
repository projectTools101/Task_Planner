/**
 * Export Module
 * Handles copying tasks as formatted text
 */

import { state } from './state.js';
import { getTotalPlannedHours, showToast } from './ui.js';

/**
 * Copy all tasks as formatted text to clipboard
 */
export function copyAsText() {
  let text = '';
  const total = parseFloat(document.getElementById('totalHours').value) || 0;
  const planned = getTotalPlannedHours();

  text += `Total: ${total}h | Planned: ${planned}h\n`;
  text += '─'.repeat(40) + '\n\n';

  state.groups.forEach(group => {
    if (group.tasks.length === 0) return;

    if (group.mode === 'heading' && group.title) {
      text += group.title + '\n';
      group.tasks.forEach(task => {
        if (task.name) {
          text += `${task.name} - ${task.hours}h\n`;
        }
      });
      text += '\n';
    } else if (group.mode === 'prefix' && group.title) {
      group.tasks.forEach(task => {
        if (task.name) {
          text += `${group.title} - ${task.name} - ${task.hours}h\n`;
        }
      });
      text += '\n';
    } else {
      // No title
      group.tasks.forEach(task => {
        if (task.name) {
          text += `${task.name} - ${task.hours}h\n`;
        }
      });
      text += '\n';
    }
  });

  if (state.ungroupedTasks.length > 0) {
    state.ungroupedTasks.forEach(task => {
      if (task.name) {
        text += `${task.name} - ${task.hours}h\n`;
      }
    });
  }

  navigator.clipboard.writeText(text.trim()).then(() => {
    showToast('Copied to clipboard!');
  });
}
