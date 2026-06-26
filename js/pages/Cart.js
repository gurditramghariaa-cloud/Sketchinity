import { store } from '../store.js';

export function Cart() {
  const cartItems = store.cart;

  if (cartItems.length === 0) {
    return `
      <div class="container text-center section-padding" style="min-height: 500px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <i data-lucide="shopping-bag" style="width: 80px; height: 80px; stroke-width: 1.5; color: var(--color-primary); margin-bottom: var(--spacing-md);"></i>
        <h2>YOUR STASH IS EMPTY</h2>
        <p class="text-muted" style="margin-top: 12px; max-width: 400px; margin-left: auto; margin-right: auto;">
          You haven't loaded any spray cans, sketchbooks, or markers to your kit yet. Let's head over to the catalog.
        </p>
        <a href="#shop" class="btn btn-primary" style="margin-top: var(--spacing-lg);">EXPLORE SUPPLIES</a>
      </div>
    `;
  }

  // Calculate pricing numbers
  const subtotal = store.getCartTotal();
  const shipping = subtotal >= 75 ? 0.00 : 9.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  const tableRowsHtml = cartItems.map(item => `
    <tr data-id="${item.product.id}">
      <td class="cart-product-cell">
        <div class="product-svg-thumb" style="width: 80px; height: 80px; border: var(--border-thin); border-radius: var(--border-radius-sm); overflow: hidden; background: var(--color-gray-light); display: flex; align-items: center; justify-content: center;">
          <img src="${item.product.imagePath}" alt="${item.product.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div>
          <div class="cart-product-category">${item.product.category}</div>
          <a href="#product?id=${item.product.id}" class="cart-product-name">${item.product.name}</a>
        </div>
      </td>
      <td>
        <span style="font-weight: 700;">$${item.product.price.toFixed(2)}</span>
      </td>
      <td>
        <div class="qty-updater" style="display: inline-flex;">
          <button class="cart-qty-dec-btn" data-id="${item.product.id}">-</button>
          <span>${item.quantity}</span>
          <button class="cart-qty-inc-btn" data-id="${item.product.id}">+</button>
        </div>
      </td>
      <td>
        <span style="font-weight: 800; color: var(--color-primary);">$${(item.product.price * item.quantity).toFixed(2)}</span>
      </td>
      <td>
        <button class="cart-item-remove-btn" data-id="${item.product.id}" style="color: var(--color-error); cursor: pointer;" title="Remove Item">
          <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
        </button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="container section-padding">
      <h1 style="margin-bottom: var(--spacing-xxl);">YOUR STASH BAG</h1>
      
      <div class="cart-layout">
        <!-- Left: Item Table list -->
        <div class="cart-table-container">
          <table class="cart-table">
            <thead>
              <tr>
                <th>SUPPLY DETAILS</th>
                <th>PRICE</th>
                <th>QTY</th>
                <th>TOTAL</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHtml}
            </tbody>
          </table>
          
          <div style="padding: 16px; display: flex; justify-content: space-between; background-color: var(--color-gray-light); border-top: var(--border-thick);">
            <a href="#shop" class="btn btn-secondary btn-sm">
              <i data-lucide="arrow-left" style="width: 14px; height: 14px;"></i> CONTINUE SHOPPING
            </a>
            <button id="clear-entire-cart-btn" class="btn btn-dark btn-sm" style="background-color: var(--color-error); border-color: var(--color-error); color: white;">
              <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> CLEAR STASH
            </button>
          </div>
        </div>

        <!-- Right: Invoice summary card -->
        <div class="cart-summary-box">
          <h3 class="cart-summary-title">ORDER SUMMARY</h3>
          
          <div class="summary-row">
            <span>Stash Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          
          <div class="summary-row">
            <span>Shipping:</span>
            <span>${shipping === 0 ? '<span class="text-success" style="font-weight: 800;">FREE</span>' : `$${shipping.toFixed(2)}`}</span>
          </div>
          
          <div class="summary-row" style="font-size: 0.85rem; color: var(--color-gray-medium); margin-top: -8px;">
            <span>${shipping === 0 ? 'Free Shipping Active!' : 'Add $75.00 for free shipping.'}</span>
          </div>

          <div class="summary-row">
            <span>Est. Taxes (7%):</span>
            <span>$${tax.toFixed(2)}</span>
          </div>

          <div class="summary-row total">
            <span>Total Stash Cost:</span>
            <span>$${total.toFixed(2)}</span>
          </div>

          <a href="#checkout" class="btn btn-primary w-full text-center" style="margin-top: var(--spacing-lg); padding: 16px 0;">
            PROCEED TO CHECKOUT <i data-lucide="arrow-right" style="width: 18px; height: 18px;"></i>
          </a>
          
          <div class="text-center" style="margin-top: 16px; font-size: 0.8rem; color: var(--color-gray-dark);">
            <i data-lucide="shield-check" style="width: 14px; height: 14px; vertical-align: middle;"></i> Secure Checkout processed via Sketchinity Art Network.
          </div>
        </div>
      </div>
    </div>
  `;
}

// Controller Initialization
Cart.init = function() {
  const table = document.querySelector('.cart-table');
  const clearBtn = document.getElementById('clear-entire-cart-btn');

  if (!table) return;

  // Qty Dec
  table.querySelectorAll('.cart-qty-dec-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = store.cart.find(i => i.product.id === Number(id));
      if (item) {
        if (item.quantity > 1) {
          store.updateCartQty(id, item.quantity - 1);
          window.Sketchinity.router.handleRoute(); // Refresh
        } else {
          store.removeFromCart(id);
          window.Sketchinity.showToast("Item removed from stash.", "info");
          window.Sketchinity.router.handleRoute(); // Refresh
        }
      }
    });
  });

  // Qty Inc
  table.querySelectorAll('.cart-qty-inc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = store.cart.find(i => i.product.id === Number(id));
      if (item) {
        if (item.quantity < item.product.stock) {
          store.updateCartQty(id, item.quantity + 1);
          window.Sketchinity.router.handleRoute(); // Refresh
        } else {
          window.Sketchinity.showToast(`Cannot add more. ${item.product.stock} items left in stock.`, "warning");
        }
      }
    });
  });

  // Remove completely
  table.querySelectorAll('.cart-item-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      store.removeFromCart(id);
      window.Sketchinity.showToast("Item removed from stash.", "info");
      window.Sketchinity.router.handleRoute(); // Refresh
    });
  });

  // Clear entire stash
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to clear your entire stash bag?")) {
        store.clearCart();
        window.Sketchinity.showToast("Stash bag cleared completely.", "info");
        window.Sketchinity.router.handleRoute(); // Refresh
      }
    });
  }
};
