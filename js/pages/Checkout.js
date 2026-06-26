import { store } from '../store.js';

let lastOrderResult = null; // Volatile receipt storage for checkout success renderer

export function Checkout() {
  // If checkout succeeded, render receipt layout
  if (lastOrderResult) {
    const order = lastOrderResult;
    
    // Generate items block for receipt
    const itemsHtml = order.items.map(item => `
      <div class="checkout-summary-item" style="border-bottom: 1px dashed var(--color-gray-border); padding: var(--spacing-sm) 0;">
        <span>${item.product.name} (x${item.quantity})</span>
        <span style="font-weight: 700;">$${(item.product.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');

    return `
      <div class="container section-padding">
        <div class="checkout-success-box">
          <div class="success-icon">
            <i data-lucide="check" style="stroke-width: 3;"></i>
          </div>
          <h1>ORDER CONFIRMED</h1>
          <p class="text-primary font-bold" style="font-size: 1.15rem; margin-top: 8px;">Order ID: ${order.id}</p>
          <p class="text-muted" style="margin-top: 8px;">Thank you for shopping with Sketchinity! We've registered your order and our stash crew is already packing it.</p>
          
          <div style="text-align: left; background-color: var(--color-gray-light); border: var(--border-thin); border-radius: var(--border-radius-sm); margin: var(--spacing-xl) 0; padding: var(--spacing-lg);">
            <h3 style="font-size: 1.1rem; border-bottom: var(--border-thin); padding-bottom: 4px; margin-bottom: 12px; color: var(--color-primary);">RECEIPT DETAILS</h3>
            
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.95rem;">
              <div><strong>Recipient:</strong> ${order.customer.name}</div>
              <div><strong>Email:</strong> ${order.customer.email}</div>
              <div><strong>Ship To:</strong> ${order.shipping.street}, ${order.shipping.city}, ${order.shipping.state} (${order.shipping.zip})</div>
              
              <div style="border-top: 1px solid var(--color-gray-border); margin-top: 12px; padding-top: 12px;">
                ${itemsHtml}
              </div>
              
              <div style="display: flex; justify-content: space-between; font-weight: 900; font-size: 1.15rem; margin-top: 8px; border-top: var(--border-thin); padding-top: 8px;">
                <span>Total Charged:</span>
                <span>$${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div style="display: flex; gap: var(--spacing-md); justify-content: center;">
            <a href="#shop" class="btn btn-primary" id="success-shop-btn">SHOP MORE GEAR</a>
            <a href="#auth" class="btn btn-secondary" id="success-orders-btn">TRACK ORDERS</a>
          </div>
        </div>
      </div>
    `;
  }

  // Otherwise, render form
  const cartItems = store.cart;
  if (cartItems.length === 0) {
    return `
      <div class="container text-center section-padding">
        <h2>NO SUPPLIES TO CHECKOUT</h2>
        <p class="text-muted" style="margin-top: 16px;">Add items to your stash bag before checking out.</p>
        <a href="#shop" class="btn btn-primary" style="margin-top: var(--spacing-md);">GO TO SHOP</a>
      </div>
    `;
  }

  // Pre-fill user data if logged in
  const loggedInUser = store.user || {};
  const defName = loggedInUser.username || '';
  const defEmail = loggedInUser.email || '';

  // Calculate pricing numbers
  const subtotal = store.getCartTotal();
  const shipping = subtotal >= 75 ? 0.00 : 9.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  const itemsSummaryHtml = cartItems.map(item => `
    <div class="checkout-summary-item">
      <span>${item.product.name} (x${item.quantity})</span>
      <span style="font-weight: 700;">$${(item.product.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');

  return `
    <div class="container section-padding">
      <h1 style="margin-bottom: var(--spacing-xxl);">SECURE CHECKOUT</h1>
      
      <div class="checkout-layout">
        <!-- Left Column: Shipping & Details Forms -->
        <div class="checkout-form-box">
          <form id="checkout-main-form">
            <!-- 1. Customer Details -->
            <h3 class="checkout-section-title">1. CUSTOMER DETAILS</h3>
            
            <div class="form-group">
              <label for="cust-name">Full Name *</label>
              <input type="text" id="cust-name" class="input-control" placeholder="e.g. John Doe" value="${defName}" required>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="cust-email">Email Address *</label>
                <input type="email" id="cust-email" class="input-control" placeholder="e.g. john@artist.com" value="${defEmail}" required>
              </div>
              
              <div class="form-group">
                <label for="cust-phone">Phone Number *</label>
                <input type="tel" id="cust-phone" class="input-control" placeholder="e.g. 555-0199" required>
              </div>
            </div>

            <!-- 2. Shipping Address -->
            <h3 class="checkout-section-title">2. SHIPPING ADDRESS</h3>
            
            <div class="form-group">
              <label for="ship-street">Street Address *</label>
              <input type="text" id="ship-street" class="input-control" placeholder="e.g. 100 Ink Splatter Road, Apt 3B" required>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="ship-city">City *</label>
                <input type="text" id="ship-city" class="input-control" placeholder="e.g. New York" required>
              </div>
              
              <div class="form-group">
                <label for="ship-zip">Zip / Postal Code *</label>
                <input type="text" id="ship-zip" class="input-control" placeholder="e.g. 10001" required>
              </div>
            </div>
            
            <div class="form-group">
              <label for="ship-state">State / Province *</label>
              <input type="text" id="ship-state" class="input-control" placeholder="e.g. NY" required>
            </div>

            <!-- 3. Mock Payment Info -->
            <h3 class="checkout-section-title">3. PAYMENT SIMULATION</h3>
            <p style="font-size: 0.85rem; color: var(--color-gray-medium); margin-bottom: var(--spacing-sm);">This is a safe staging checkout flow. No real credit card details are needed.</p>
            
            <div class="form-group">
              <label for="card-num">Card Number (Mock) *</label>
              <input type="text" id="card-num" class="input-control" placeholder="4111 2222 3333 4444" required>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="card-expiry">Expiry Date *</label>
                <input type="text" id="card-expiry" class="input-control" placeholder="MM/YY" required>
              </div>
              <div class="form-group">
                <label for="card-cvv">CVV *</label>
                <input type="password" id="card-cvv" class="input-control" placeholder="***" maxLength="3" required>
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-full" style="margin-top: var(--spacing-lg); padding: 16px 0;">PLACE ORDER</button>
          </form>
        </div>

        <!-- Right Column: Order items summaries -->
        <div class="checkout-summary-box">
          <h3 style="font-size: 1.2rem; border-bottom: var(--border-thin); padding-bottom: var(--spacing-xs); margin-bottom: var(--spacing-md);">STASH INVENTORY</h3>
          
          <div class="checkout-summary-items">
            ${itemsSummaryHtml}
          </div>

          <div style="margin-top: var(--spacing-md);">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Shipping:</span>
              <span>${shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div class="summary-row">
              <span>Tax (7%):</span>
              <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total" style="font-size: 1.2rem; border-top: var(--border-thin); padding-top: 12px; margin-top: 12px; font-weight: 800;">
              <span>Total cost:</span>
              <span>$${total.toFixed(2)}</span>
            </div>
          </div>
          
          <!-- Mock Promo Code panel -->
          <div style="border-top: 1.5px dashed var(--color-gray-border); margin-top: var(--spacing-lg); padding-top: var(--spacing-md);">
            <label style="font-family: var(--font-family-display); font-weight: 800; font-size: 0.85rem; display: block; margin-bottom: 8px;">COUPON / PROMO CODE</label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="promo-code-input" class="input-control" placeholder="e.g. STASH10" style="padding: 8px; flex-grow: 1; font-size: 0.9rem;">
              <button id="promo-apply-btn" class="btn btn-dark btn-sm">APPLY</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Controller Initialization
Checkout.init = function() {
  const form = document.getElementById('checkout-main-form');
  const promoApplyBtn = document.getElementById('promo-apply-btn');
  const promoInput = document.getElementById('promo-code-input');

  // If order confirm is showing, bind receipt buttons click
  const shopMoreBtn = document.getElementById('success-shop-btn');
  const trackBtn = document.getElementById('success-orders-btn');

  if (shopMoreBtn && trackBtn) {
    const clearLastReceipt = () => {
      lastOrderResult = null; // Clear volatile receipt state
    };
    shopMoreBtn.addEventListener('click', clearLastReceipt);
    trackBtn.addEventListener('click', clearLastReceipt);
    return;
  }

  if (!form) return;

  // Checkout form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const customerDetails = {
      name: document.getElementById('cust-name').value,
      email: document.getElementById('cust-email').value,
      phone: document.getElementById('cust-phone').value
    };

    const shippingAddress = {
      street: document.getElementById('ship-street').value,
      city: document.getElementById('ship-city').value,
      zip: document.getElementById('ship-zip').value,
      state: document.getElementById('ship-state').value
    };

    // Perform Checkout in Store
    const res = store.checkout(customerDetails, shippingAddress);
    if (res.success) {
      lastOrderResult = res.order; // Cache order details for receipt rendering
      window.Sketchinity.showToast("Stash order created successfully!", "success");
      window.Sketchinity.router.handleRoute(); // Re-render to display checkout receipt
    } else {
      window.Sketchinity.showToast(res.message || "Failed to create order.", "error");
    }
  });

  // Apply Coupon code
  if (promoApplyBtn && promoInput) {
    promoApplyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const code = promoInput.value.toUpperCase().trim();
      if (code === "STASH10" || code === "STUDENT10") {
        window.Sketchinity.showToast("Promo applied! Enjoy mock 10% discount.", "success");
        // In this mock, we can just show the toast. 
      } else {
        window.Sketchinity.showToast("Invalid promo code.", "error");
      }
    });
  }
};
