async function updateAuthNav() {
  const authUserLink = document.getElementById('authUserLink');
  if (!authUserLink) return;

  const authWrapper = authUserLink.parentElement;
  authWrapper.classList.add('relative');

  const logoutMenuId = 'authLogoutMenu';
  let logoutMenu = document.getElementById(logoutMenuId);

  function createLogoutMenu() {
    logoutMenu = document.createElement('div');
    logoutMenu.id = logoutMenuId;
    logoutMenu.className = 'absolute right-0 top-full mt-2 w-36 rounded-2xl bg-white text-slate-900 shadow-xl ring-1 ring-slate-200 hidden z-50';
    logoutMenu.innerHTML = `
      <button id="profileBtn" class="w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-100">
        Profile
      </button>
      <button id="logoutBtn" class="w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-100">
        Logout
      </button>
    `;
    authWrapper.appendChild(logoutMenu);

    document.addEventListener('click', event => {
      if (!authWrapper.contains(event.target)) {
        logoutMenu.classList.add('hidden');
      }
    });
  }

  async function logout() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  function goProfile() {
    window.location.href = '/profile.html';
  }

  try {
    const response = await fetch('/api/auth/session', {
      credentials: 'include'
    });
    console.log('Session response status:', response.status);
    if (response.ok) {
      const { user } = await response.json();
      console.log('Logged in user:', user);
      const displayName = user.username || 'User';
      authUserLink.href = '#';
      authUserLink.innerHTML = `<i class="fa-solid fa-user"></i><span>${displayName}</span>`;
      authUserLink.title = 'Click for logout';
      authUserLink.classList.add('cursor-pointer');

      if (!logoutMenu) {
        createLogoutMenu();
      }

      const logoutBtn = document.getElementById('logoutBtn');
      const profileBtn = document.getElementById('profileBtn');
      logoutBtn?.addEventListener('click', logout);
      profileBtn?.addEventListener('click', goProfile);

      authUserLink.addEventListener('click', event => {
        event.preventDefault();
        if (logoutMenu) {
          logoutMenu.classList.toggle('hidden');
        }
      });
    } else {
      console.log('Not logged in, status:', response.status);
      authUserLink.href = '/signup.html';
      authUserLink.innerHTML = '<i class="fa-solid fa-user"></i><span>Login</span>';
      authUserLink.title = 'Login or signup';
      if (logoutMenu) logoutMenu.classList.add('hidden');
    }
  } catch (error) {
    console.error('Unable to load auth state:', error);
    authUserLink.href = '/signup.html';
    authUserLink.innerHTML = '<i class="fa-solid fa-user"></i><span>Login</span>';
    if (logoutMenu) logoutMenu.classList.add('hidden');
  }
}

window.addEventListener('DOMContentLoaded', updateAuthNav);