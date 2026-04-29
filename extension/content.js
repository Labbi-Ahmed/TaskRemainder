// Runs inside the web app tab.
// Syncs localStorage data → chrome.storage.local so the popup can read it.
// Also listens for tasks added by the popup and writes them into localStorage.

const SYNC_KEYS = ['task_categories', 'task_tags', 'task_time_slots', 'task_items'];

function syncToStorage() {
  const data = {};
  SYNC_KEYS.forEach(key => {
    const raw = localStorage.getItem(key);
    if (raw) {
      try { data[key] = JSON.parse(raw); } catch {}
    }
  });
  if (Object.keys(data).length) chrome.storage.local.set(data);
}

// Initial sync on page load
syncToStorage();

// Re-sync when the web app itself saves to localStorage (other-tab changes)
window.addEventListener('storage', (e) => {
  if (SYNC_KEYS.includes(e.key)) syncToStorage();
});

// Listen for task created by the popup → write it into web app localStorage
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'ADD_TASK') {
    const existing = JSON.parse(localStorage.getItem('task_items') || '[]');
    existing.unshift(msg.task);
    localStorage.setItem('task_items', JSON.stringify(existing));
    // Tell React to reload tasks from localStorage without a page refresh
    window.dispatchEvent(new CustomEvent('extension-task-added'));
  }
});
