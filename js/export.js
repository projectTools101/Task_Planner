/**
 * Export Module
 * Handles copying and generating formatted text output
 */

import { state } from './state.js';
import { getTotalPlannedHours, showToast } from './ui.js';

/**
 * Generate formatted text from current state
 */
export function generateText() {
  let text = '';
  const total = parseFloat(document.getElementById('totalHours')?.value) || 0;
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
      // No title - just list tasks
      group.tasks.forEach(task => {
        if (task.name) {
          text += `${task.name} - ${task.hours}h\n`;
        }
      });
      text += '\n';
    }
  });

  return text.trim();
}

/**
 * Copy all tasks as formatted text to clipboard
 */
export function copyAsText() {
  const text = generateText();
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard!');
  });
}
