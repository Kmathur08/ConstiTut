const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const loginCount = document.getElementById('loginCount');
const streakCount = document.getElementById('streakCount');
const yearLabel = document.getElementById('yearLabel');
const heatmapGrid = document.getElementById('heatmapGrid');
const historyList = document.getElementById('historyList');
const errorBanner = document.getElementById('errorBanner');

const heatmapColors = [
  'bg-slate-200 border-slate-200',
  'bg-emerald-200 border-emerald-200',
  'bg-emerald-300 border-emerald-300',
  'bg-emerald-400 border-emerald-400',
  'bg-emerald-600 border-emerald-600 text-white'
];

function showError(message) {
  if (!errorBanner) return;
  errorBanner.textContent = message;
  errorBanner.classList.remove('hidden');
}

function createHeatmapCell(entry) {
  const cell = document.createElement('div');
  const colorClass = heatmapColors[Math.min(Math.max(entry.level || 0, 0), heatmapColors.length - 1)];
  cell.className = `h-3 w-3 rounded-sm border ${colorClass}`;
  cell.title = `${entry.date}: ${entry.level > 0 ? 'Logged in' : 'No login'}`;
  return cell;
}

function renderHeatmap(heatmap) {
  if (!heatmapGrid) return;
  heatmapGrid.innerHTML = '';
  heatmap.forEach(entry => {
    heatmapGrid.appendChild(createHeatmapCell(entry));
  });
}

function renderHistory(loginHistory) {
  if (!historyList) return;
  historyList.innerHTML = '';
  const recent = loginHistory.slice(-10).reverse();
  if (recent.length === 0) {
    historyList.innerHTML = '<li class="text-slate-500">No login history yet.</li>';
    return;
  }
  recent.forEach(date => {
    const item = document.createElement('li');
    item.className = 'rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200';
    item.textContent = date;
    historyList.appendChild(item);
  });
}

async function loadProfile() {
  try {
    const response = await fetch('/api/auth/profile', { credentials: 'include' });
    if (response.status === 401) {
      window.location.href = '/signup.html';
      return;
    }
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Unable to load profile.');
    }

    const data = await response.json();
    const user = data.user || {};
    const displayName = user.name || user.username || 'User';

    if (profileName) profileName.textContent = `Hello, ${displayName}!`;
    if (profileEmail) profileEmail.textContent = user.email || '';
    if (loginCount) loginCount.textContent = data.totalLogins ?? '0';
    if (streakCount) streakCount.textContent = `${data.streak ?? 0} day${data.streak === 1 ? '' : 's'}`;
    if (yearLabel) yearLabel.textContent = data.currentYear || new Date().getFullYear();

    renderHeatmap(data.heatmap || []);
    renderHistory(data.loginHistory || []);
  } catch (error) {
    console.error(error);
    showError(error.message || 'Something went wrong while loading your profile.');
  }
}

window.addEventListener('DOMContentLoaded', loadProfile);
