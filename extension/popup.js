// Set this to your real backend URL when the API is ready.
// While it contains 'your-api.example.com' the extension works fully offline.
const API_BASE = 'https://your-api.example.com';
const API_READY = !API_BASE.includes('your-api.example.com');

// Default seed data — mirrors the web app defaults so the form is never empty
const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Work',     color: '#6366f1' },
  { id: '2', name: 'Personal', color: '#10b981' },
  { id: '3', name: 'Learning', color: '#f59e0b' },
];
const DEFAULT_TAGS = [
  { id: '1', name: 'Tonight', color: '#ef4444' },
  { id: '2', name: 'Weekly',  color: '#3b82f6', categoryId: '1' },
  { id: '3', name: 'React',   color: '#06b6d4', categoryId: '3' },
];
const DEFAULT_SLOTS = [
  { id: '1', name: 'Morning Routine', type: 'daily',  hour: 7,  minute: 30 },
  { id: '2', name: 'Morning Commute', type: 'daily',  hour: 8,  minute: 30 },
  { id: '3', name: 'Lunch Break',     type: 'daily',  hour: 13, minute: 0  },
  { id: '4', name: 'Deep Learning',   type: 'daily',  hour: 20, minute: 0  },
  { id: '5', name: 'Weekend Learning',type: 'weekly', hour: 10, minute: 0, daysOfWeek: [0, 6] },
];

// App state
let allCategories = [];
let allTags = [];
let allTimeSlots = [];
let selectedTags = [];

// ── Helpers ────────────────────────────────────────────────────────────────

function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + id).classList.add('active');
}

function showMsg(elId, type, text) {
  const el = document.getElementById(elId);
  el.textContent = text;
  el.className = 'message ' + type;
}

function clearMsg(elId) {
  const el = document.getElementById(elId);
  el.textContent = '';
  el.className = 'message';
}

function setErr(elId, text) {
  const el = document.getElementById(elId);
  if (el) el.textContent = text;
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; });
}

function setBusy(btnId, busy) {
  const btn = document.getElementById(btnId);
  btn.disabled = busy;
  const labels = { 'btn-login': ['Log in', 'Logging in…'], 'btn-add': ['Create Task', 'Saving…'] };
  btn.textContent = labels[btnId][busy ? 1 : 0];
}

// ── Auth ───────────────────────────────────────────────────────────────────

function loadAuth() {
  chrome.storage.local.get(['token', 'user_email'], ({ token, user_email }) => {
    if (token) {
      showAuthHeader(user_email);
      loadAppData();
      showView('task');
    } else {
      document.getElementById('header-auth').style.display = 'none';
      showView('login');
    }
  });
}

function showAuthHeader(email) {
  const el = document.getElementById('header-auth');
  document.getElementById('header-email').textContent = email || '';
  el.style.cssText = 'display:flex;align-items:center;gap:8px;';
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMsg('login-message');
  setBusy('btn-login', true);

  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    if (API_READY) {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || 'Invalid email or password.');
      }
      const d = await res.json();
      const token = d.token || d.access_token;
      if (!token) throw new Error('No token received from server.');
      chrome.storage.local.set({ token, user_email: email });
    } else {
      // Dev mode — accept any credentials
      chrome.storage.local.set({ token: 'dev-token', user_email: email });
    }
    showAuthHeader(email);
    loadAppData();
    showView('task');
  } catch (err) {
    showMsg('login-message', 'error', err.message);
  } finally {
    setBusy('btn-login', false);
  }
});

document.getElementById('btn-logout').addEventListener('click', () => {
  chrome.storage.local.remove(['token', 'user_email'], () => {
    document.getElementById('header-auth').style.display = 'none';
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    clearMsg('login-message');
    showView('login');
  });
});

// ── Load web-app data from chrome.storage.local ────────────────────────────
// The content script (content.js) syncs the web app's localStorage into
// chrome.storage.local whenever the user has the web app tab open.

function loadAppData() {
  chrome.storage.local.get(
    ['task_categories', 'task_tags', 'task_time_slots'],
    (data) => {
      allCategories = data.task_categories?.length ? data.task_categories : DEFAULT_CATEGORIES;
      allTags       = data.task_tags?.length       ? data.task_tags       : DEFAULT_TAGS;
      allTimeSlots  = data.task_time_slots?.length ? data.task_time_slots : DEFAULT_SLOTS;

      buildScheduleOptions();
      buildCategoryOptions();
      renderTags('');
    }
  );
}

// ── Build dropdowns ────────────────────────────────────────────────────────

function buildScheduleOptions() {
  const sel = document.getElementById('task-schedule');
  while (sel.options.length > 2) sel.remove(2); // keep placeholder + custom
  allTimeSlots.forEach(slot => {
    const opt = document.createElement('option');
    opt.value = slot.id;
    opt.textContent = `${slot.name} (${slot.hour}:${String(slot.minute).padStart(2, '0')})`;
    sel.appendChild(opt);
  });
}

function buildCategoryOptions() {
  const sel = document.getElementById('task-category');
  while (sel.options.length > 1) sel.remove(1); // keep "No category"
  allCategories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.name;
    sel.appendChild(opt);
  });
}

// ── Tags ───────────────────────────────────────────────────────────────────

function renderTags(categoryId) {
  selectedTags = [];
  const container = document.getElementById('tags-container');
  const label     = document.getElementById('tags-label');

  const filtered = allTags.filter(tag =>
    categoryId ? tag.categoryId === categoryId : !tag.categoryId
  );

  if (categoryId) {
    const cat = allCategories.find(c => c.id === categoryId);
    label.textContent = cat ? `TAGS FOR ${cat.name.toUpperCase()}` : 'TAGS';
  } else {
    label.textContent = 'GLOBAL TAGS';
  }

  if (!filtered.length) {
    container.innerHTML = '<span class="tags-empty">No tags available.</span>';
    return;
  }

  container.innerHTML = '';
  filtered.forEach(tag => {
    const slot = tag.timeSlotId ? allTimeSlots.find(s => s.id === tag.timeSlotId) : null;
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'tag-chip';
    chip.dataset.tagId = tag.id;
    chip.dataset.color = tag.color;

    if (slot) {
      chip.innerHTML =
        `${tag.name}<small>${slot.hour}:${String(slot.minute).padStart(2, '0')}</small>`;
    } else {
      chip.textContent = tag.name;
    }

    chip.addEventListener('click', () => toggleTag(chip, tag));
    container.appendChild(chip);
  });
}

function toggleTag(chip, tag) {
  const idx = selectedTags.indexOf(tag.id);
  if (idx > -1) {
    selectedTags.splice(idx, 1);
    chip.classList.remove('selected');
    chip.style.backgroundColor = '';
    chip.style.borderColor = '';
    chip.style.color = '';
  } else {
    selectedTags.push(tag.id);
    chip.classList.add('selected');
    chip.style.backgroundColor = tag.color;
    chip.style.borderColor = tag.color;
    chip.style.color = '#fff';
  }
}

// ── Schedule change ────────────────────────────────────────────────────────

document.getElementById('task-schedule').addEventListener('change', (e) => {
  const val       = e.target.value;
  const customGrp = document.getElementById('custom-date-group');
  const hint      = document.getElementById('schedule-hint');
  customGrp.style.display = val === 'custom' ? 'block' : 'none';
  hint.style.display = (val && val !== 'custom') ? 'block' : 'none';
});

// ── Category change ────────────────────────────────────────────────────────

document.getElementById('task-category').addEventListener('change', (e) => {
  renderTags(e.target.value);
});

// ── Validation ─────────────────────────────────────────────────────────────

function validate() {
  clearErrors();
  let ok = true;

  const title       = document.getElementById('task-title').value.trim();
  const schedule    = document.getElementById('task-schedule').value;
  const dueDate     = document.getElementById('task-duedate').value;
  const contentLink = document.getElementById('task-link').value.trim();

  if (!title) {
    setErr('err-title', 'Title is required');
    ok = false;
  }
  if (!schedule) {
    setErr('err-schedule', 'Please select a schedule option');
    ok = false;
  }
  if (schedule === 'custom' && !dueDate) {
    setErr('err-duedate', 'Due date and time are required for custom scheduling');
    ok = false;
  }
  if (contentLink && !/^https?:\/\/.+/.test(contentLink)) {
    setErr('err-link', 'Please enter a valid URL (starting with http:// or https://)');
    ok = false;
  }

  return ok;
}

// ── Submit ─────────────────────────────────────────────────────────────────

function saveLocally(task) {
  // 1. Save to extension storage
  chrome.storage.local.get(['tasks'], ({ tasks = [] }) => {
    tasks.unshift(task);
    chrome.storage.local.set({ tasks });
  });

  // 2. Push to web app localStorage via content script if the tab is open
  chrome.tabs.query({ url: ['http://localhost:3000/*', 'http://localhost:3001/*'] }, (tabs) => {
    if (!tabs.length) return;
    chrome.tabs.sendMessage(tabs[0].id, { type: 'ADD_TASK', task }, () => {
      void chrome.runtime.lastError; // suppress "no receiving end" when tab has no content script
    });
  });
}

document.getElementById('task-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validate()) return;

  clearMsg('task-message');
  setBusy('btn-add', true);

  const schedule = document.getElementById('task-schedule').value;
  const dueDate  = document.getElementById('task-duedate').value;

  // Filter tags: only keep tags that belong to the chosen category (mirrors web app logic)
  const categoryId = document.getElementById('task-category').value;
  const validTags  = selectedTags.filter(tagId => {
    const tag = allTags.find(t => t.id === tagId);
    return tag && (tag.categoryId === categoryId || (!tag.categoryId && !categoryId));
  });

  const task = {
    id:          Date.now().toString(),
    title:       document.getElementById('task-title').value.trim(),
    contentLink: document.getElementById('task-link').value.trim()  || undefined,
    notes:       document.getElementById('task-notes').value.trim() || undefined,
    priority:    document.getElementById('task-priority').value,
    category:    categoryId || undefined,
    tags:        validTags,
    dueDate:     schedule === 'custom' ? new Date(dueDate).toISOString() : undefined,
    timeSlotId:  schedule !== 'custom' && schedule ? schedule : undefined,
    status:      'Pending',
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  };

  chrome.storage.local.get(['token'], async ({ token }) => {
    if (!token) { showView('login'); return; }

    try {
      if (API_READY) {
        const res = await fetch(`${API_BASE}/api/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(task),
        });
        if (res.status === 401) {
          chrome.storage.local.remove(['token', 'user_email']);
          showView('login');
          return;
        }
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.message || 'Failed to add task.');
        }
      } else {
        saveLocally(task);
      }

      // Reset form
      document.getElementById('task-form').reset();
      document.getElementById('custom-date-group').style.display = 'none';
      document.getElementById('schedule-hint').style.display = 'none';
      renderTags(document.getElementById('task-category').value);

      showMsg('task-message', 'success', 'Task created successfully!');
      setTimeout(() => clearMsg('task-message'), 3000);
    } catch (err) {
      showMsg('task-message', 'error', err.message);
    } finally {
      setBusy('btn-add', false);
    }
  });
});

// ── Init ───────────────────────────────────────────────────────────────────
loadAuth();
