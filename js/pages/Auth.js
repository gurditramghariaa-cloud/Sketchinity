import { store } from '../store.js';

let activeTab = 'login'; // Tab toggle state: 'login' or 'register'

export function Auth() {
  const user = store.user;

  // 1. If logged in, render dashboard panel
  if (user) {
    const orders = store.getUserOrders();
    const ordersHtml = orders.length === 0
      ? `
        <div class="text-center" style="padding: var(--spacing-xl) 0;">
          <i data-lucide="package" style="width: 48px; height: 48px; color: var(--color-gray-medium); margin-bottom: 12px;"></i>
          <p class="text-muted">You haven't ordered any art stash bundles yet.</p>
          <a href="#shop" class="btn btn-primary btn-sm" style="margin-top: 16px;">BROWSE THE SHOP</a>
        </div>
      `
      : `
        <table class="orders-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>DATE</th>
              <th>ITEMS COUNT</th>
              <th>TOTAL COST</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(order => {
              const qty = order.items.reduce((s, i) => s + i.quantity, 0);
              const statusClass = order.status.toLowerCase() === 'shipped' ? 'shipped' : 'processing';
              return `
                <tr>
                  <td style="font-weight: 800; color: var(--color-primary);">${order.id}</td>
                  <td>${order.date}</td>
                  <td>${qty} items</td>
                  <td style="font-weight: 700;">$${order.total.toFixed(2)}</td>
                  <td>
                    <span class="order-status ${statusClass}">${order.status}</span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;

    return `
      <div class="container section-padding">
        <h1 style="margin-bottom: var(--spacing-xxl);">ARTIST HQ</h1>
        
        <div class="dashboard-grid">
          <!-- Sidebar: User Info Card & Menu -->
          <aside class="dashboard-sidebar">
            <div class="dashboard-user-card">
              <div class="dashboard-avatar">
                ${user.username.slice(0, 2).toUpperCase()}
              </div>
              <h3>${user.username}</h3>
              <p style="font-size: 0.85rem; color: var(--color-gray-dark); margin-bottom: var(--spacing-sm);">${user.email}</p>
              
              <span class="badge" style="position: static; font-size: 0.8rem; padding: 4px 10px; height: auto; border: var(--border-thin); border-radius: var(--border-radius-sm); background-color: var(--color-primary); color: white;">
                ${user.artistLevel || 'Student'} ARTIST
              </span>
            </div>
            
            <ul class="dashboard-menu">
              <li class="dashboard-menu-item active" id="menu-orders-btn">
                <i data-lucide="package-open"></i> MY INVENTORY ORDERS
              </li>
              <li class="dashboard-menu-item" id="dashboard-logout-btn" style="color: var(--color-error); margin-top: var(--spacing-lg);">
                <i data-lucide="log-out"></i> LOGOUT
              </li>
            </ul>
          </aside>

          <!-- Main Content: Orders History Table -->
          <main class="dashboard-content-box">
            <h2 style="font-size: 1.6rem; border-bottom: var(--border-thick); padding-bottom: 8px; margin-bottom: var(--spacing-xl); color: var(--color-primary);">ORDER STASH TRACKER</h2>
            ${ordersHtml}
          </main>
        </div>
      </div>
    `;
  }

  // 2. Otherwise, render Login / register Tab Switcher
  const loginActive = activeTab === 'login';

  return `
    <div class="container section-padding">
      <div class="auth-wrapper">
        <!-- Tab buttons -->
        <div class="auth-tabs">
          <div class="auth-tab ${loginActive ? 'active' : ''}" id="tab-login-btn">LOG IN</div>
          <div class="auth-tab ${!loginActive ? 'active' : ''}" id="tab-register-btn">SIGN UP</div>
        </div>

        <div class="auth-content">
          <!-- Login Form Content -->
          ${loginActive ? `
            <h2 style="font-size: 1.5rem; margin-bottom: var(--spacing-sm);">WELCOME BACK, CREATOR</h2>
            <p class="text-muted" style="margin-bottom: var(--spacing-lg); font-size: 0.95rem;">Enter your credentials to access your artist dashboard.</p>
            
            <div style="background-color: var(--color-gray-light); border: 1.5px dashed var(--color-gray-border); padding: 12px; border-radius: var(--border-radius-sm); margin-bottom: var(--spacing-md); font-size: 0.85rem;">
              <strong>Staging Login Tip:</strong> Use email <code style="color: var(--color-primary); font-weight: 700;">artist@sketchinity.com</code> and password <code style="color: var(--color-primary); font-weight: 700;">paint123</code> to test account features.
            </div>

            <form id="auth-login-form">
              <div class="form-group">
                <label for="login-email">Email Address *</label>
                <input type="email" id="login-email" class="input-control" placeholder="artist@sketchinity.com" required>
              </div>
              <div class="form-group">
                <label for="login-password">Password *</label>
                <input type="password" id="login-password" class="input-control" placeholder="••••••••" required>
              </div>
              <button type="submit" class="btn btn-primary w-full" style="margin-top: var(--spacing-md);">LOG IN</button>
              <button type="button" id="google-login-btn" class="btn btn-secondary w-full" style="margin-top: 10px;">
                Sign in with Google
              </button>
              <button type="button" id="forgot-password-btn" class="btn btn-dark btn-sm w-full" style="margin-top: 8px;">
                Forgot Password?
              </button>
            </form>
          ` : `
            <!-- Register Form Content -->
            <h2 style="font-size: 1.5rem; margin-bottom: var(--spacing-sm);">JOIN THE INK MOB</h2>
            <p class="text-muted" style="margin-bottom: var(--spacing-lg); font-size: 0.95rem;">Register to save shipping info, review items, and track order histories.</p>
            
            <form id="auth-register-form">
              <div class="form-group">
                <label for="reg-name">Artist Handle / Name *</label>
                <input type="text" id="reg-name" class="input-control" placeholder="e.g. BanksyWannabe" required>
              </div>
              
              <div class="form-group">
                <label for="reg-email">Email Address *</label>
                <input type="email" id="reg-email" class="input-control" placeholder="e.g. artist@sketchinity.com" required>
              </div>

              <div class="form-group">
                <label for="reg-level">Your Artistic Level *</label>
                <select id="reg-level" class="input-control" style="background-color: var(--color-secondary); cursor: pointer;" required>
                  <option value="Student">Student (Learning)</option>
                  <option value="Hobbyist">Hobbyist (Casual)</option>
                  <option value="Pro">Pro Artist (Commercial)</option>
                </select>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="reg-password">Password *</label>
                  <input type="password" id="reg-password" class="input-control" placeholder="••••••••" required>
                </div>
                <div class="form-group">
                  <label for="reg-confirm">Confirm Password *</label>
                  <input type="password" id="reg-confirm" class="input-control" placeholder="••••••••" required>
                </div>
              </div>
              
              <button type="submit" class="btn btn-primary w-full" style="margin-top: var(--spacing-md);">CREATE ACCOUNT</button>
            </form>
          `}
        </div>
      </div>
    </div>
  `;
}

// Controller Initialization
Auth.init = function() {
  const user = store.user;

  // 1. Dashboard controls
  if (user) {
    const logoutBtn = document.getElementById('dashboard-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await store.logout();
        window.Sketchinity.showToast("Logged out successfully.", "info");
        window.Sketchinity.router.handleRoute(); // Refresh
      });
    }
    return;
  }

  // 2. Auth tabs login / register click
  const loginTab = document.getElementById('tab-login-btn');
  const registerTab = document.getElementById('tab-register-btn');

  if (loginTab && registerTab) {
    loginTab.addEventListener('click', () => {
      activeTab = 'login';
      window.Sketchinity.router.handleRoute(); // Refresh
    });
    registerTab.addEventListener('click', () => {
      activeTab = 'register';
      window.Sketchinity.router.handleRoute(); // Refresh
    });
  }

  // Form submits logic
  const loginForm = document.getElementById('auth-login-form');
  const regForm = document.getElementById('auth-register-form');

  // Login Submit
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;

      const res = await store.login(email, pass);
      if (res.success) {
        window.Sketchinity.showToast("Successfully logged in! Welcome back.", "success");
        window.Sketchinity.router.handleRoute(); // Redirect to Dashboard view
      } else {
        window.Sketchinity.showToast(res.message || "Invalid credentials.", "error");
      }
    });

    document.getElementById('google-login-btn')?.addEventListener('click', async () => {
      const res = await store.loginWithGoogle();
      if (res.success) {
        window.Sketchinity.showToast("Signed in with Google!", "success");
        window.Sketchinity.router.handleRoute();
      } else {
        window.Sketchinity.showToast(res.message, "error");
      }
    });

    document.getElementById('forgot-password-btn')?.addEventListener('click', async () => {
      const email = document.getElementById('login-email').value;
      if (!email) { window.Sketchinity.showToast("Enter your email first.", "error"); return; }
      const res = await store.resetPassword(email);
      window.Sketchinity.showToast(res.success ? "Reset email sent!" : res.message, res.success ? "success" : "error");
    });
  }

  // Register Submit
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const level = document.getElementById('reg-level').value;
      const pass = document.getElementById('reg-password').value;
      const confirm = document.getElementById('reg-confirm').value;

      if (pass !== confirm) {
        window.Sketchinity.showToast("Passwords do not match.", "error");
        return;
      }

      const res = await store.register(name, email, level, pass);
      if (res.success) {
        window.Sketchinity.showToast("Registration successful! Welcome to Sketchinity.", "success");
        window.Sketchinity.router.handleRoute(); // Redirect to Dashboard view
      } else {
        window.Sketchinity.showToast(res.message || "Registration failed.", "error");
      }
    });
  }
};
