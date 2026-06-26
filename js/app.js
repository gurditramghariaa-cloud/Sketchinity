import { store } from './store.js';
import { router } from './router.js?v=3';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';

// Setup Toast Notification helper
export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Icon selector based on toast type
  let iconName = 'info';
  if (type === 'success') iconName = 'check-circle';
  if (type === 'error') iconName = 'alert-triangle';
  if (type === 'warning') iconName = 'alert-circle';

  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  
  // Re-run lucide for newly added icon
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Animate show
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto remove toast after 3.5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// Side Cart Drawer controller
export function toggleCartDrawer(isOpen) {
  const drawer = document.getElementById('cart-drawer');
  if (!drawer) return;
  
  if (isOpen) {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  } else {
    drawer.classList.remove('active');
    document.body.style.overflow = ''; // Unlock
  }
}

// Update Cart Drawer DOM content on cart state changes
function renderCartDrawer() {
  const listContainer = document.getElementById('cart-drawer-items-list');
  const subtotalVal = document.getElementById('cart-drawer-subtotal-val');
  const headerBadge = document.getElementById('cart-count-badge');
  
  if (!listContainer || !subtotalVal) return;

  const cartItems = store.cart;

  // Header Badge Count
  if (headerBadge) {
    const count = store.getCartCount();
    headerBadge.textContent = count;
    headerBadge.style.display = count > 0 ? 'flex' : 'none';
  }

  // Subtotal Update
  subtotalVal.textContent = `$${store.getCartTotal().toFixed(2)}`;

  if (cartItems.length === 0) {
    listContainer.innerHTML = `
      <div class="text-center" style="margin-top: 50px;">
        <i data-lucide="shopping-bag" style="width: 48px; height: 48px; stroke-width: 1.5; color: var(--color-gray-medium);"></i>
        <p class="text-muted" style="margin-top: 16px;">YOUR STASH IS EMPTY</p>
        <p style="font-size: 0.85rem; margin-top: 8px;">Fill it up with raw supplies!</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  listContainer.innerHTML = cartItems.map(item => `
    <div class="cart-drawer-item" data-id="${item.product.id}">
      <div class="product-svg-thumb" style="width: 70px; height: 70px; border: var(--border-thin); border-radius: var(--border-radius-sm); overflow: hidden; background: var(--color-gray-light); display: flex; align-items: center; justify-content: center;">
        <img src="${item.product.imagePath}" alt="${item.product.name}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div class="cart-drawer-item-details">
        <h4 class="cart-drawer-item-title">${item.product.name}</h4>
        <span class="cart-drawer-item-price">$${item.product.price.toFixed(2)}</span>
        
        <div class="cart-drawer-item-controls">
          <div class="qty-updater">
            <button class="qty-dec-btn" data-id="${item.product.id}">-</button>
            <span>${item.quantity}</span>
            <button class="qty-inc-btn" data-id="${item.product.id}">+</button>
          </div>
          <button class="cart-drawer-item-remove remove-item-btn" data-id="${item.product.id}">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> Remove
          </button>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Setup Event Listeners for controls inside drawer
  setupCartDrawerListeners();
}

function setupCartDrawerListeners() {
  const listContainer = document.getElementById('cart-drawer-items-list');
  if (!listContainer) return;

  // Decrease quantity
  listContainer.querySelectorAll('.qty-dec-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = store.cart.find(i => i.product.id === Number(id));
      if (item) {
        if (item.quantity > 1) {
          store.updateCartQty(id, item.quantity - 1);
        } else {
          store.removeFromCart(id);
          showToast("Item removed from stash.", "info");
        }
      }
    });
  });

  // Increase quantity
  listContainer.querySelectorAll('.qty-inc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = store.cart.find(i => i.product.id === Number(id));
      if (item) {
        store.updateCartQty(id, item.quantity + 1);
      }
    });
  });

  // Remove completely
  listContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      store.removeFromCart(id);
      showToast("Item removed from stash.", "info");
    });
  });
}

// Global Application Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Mount Main Header Layout
  const headerRoot = document.getElementById('header-root');
  if (headerRoot) {
    headerRoot.innerHTML = Header();
  }

  // Mount Main Footer Layout
  const footerRoot = document.getElementById('footer-root');
  if (footerRoot) {
    footerRoot.innerHTML = Footer();
  }

  // Subscribe cart updates to re-render drawer
  store.subscribe(() => {
    renderCartDrawer();
  });

  // Setup static cart drawer controls
  const openCartBtn = document.getElementById('open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  
  if (openCartBtn) {
    openCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleCartDrawer(true);
    });
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => toggleCartDrawer(false));
  }

  if (overlay) {
    overlay.addEventListener('click', () => toggleCartDrawer(false));
  }

  // Route specific hooks for links in drawers
  const drawerLinks = document.querySelectorAll('#cart-drawer a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => toggleCartDrawer(false));
  });

  // Load Initial Store & Cart Drawer state
  renderCartDrawer();

  // Expose global window helpers for inline scripts
  window.Sketchinity = {
    store,
    router,
    showToast,
    toggleCartDrawer
  };

  // Launch Router
  router.init('main-root');
});
