export function ProductCard(product) {
  const isLimitedHtml = product.isLimited 
    ? `<div class="product-card-badge">DROP</div>` 
    : '';

  return `
    <article class="product-card">
      ${isLimitedHtml}
      
      <!-- Real high-quality realistic product image -->
      <a href="#product?id=${product.id}">
        <div class="product-card-image-container" style="width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; background: var(--color-gray-light); border: var(--border-thin); border-radius: var(--border-radius-sm); margin-bottom: var(--spacing-sm); overflow: hidden;">
          <img src="${product.imagePath}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-normal);">
        </div>
      </a>

      <div class="product-card-category">${product.category}</div>
      <a href="#product?id=${product.id}">
        <h3 class="product-card-title">${product.name}</h3>
      </a>

      <div class="product-card-meta">
        <div class="product-card-price">$${product.price.toFixed(2)}</div>
        <div class="product-card-rating">
          <i data-lucide="star" style="width: 14px; height: 14px;"></i>
          <span>${product.rating}</span>
        </div>
      </div>

      <!-- Quick Add CTA -->
      <button class="btn btn-dark btn-sm w-full quick-add-btn" data-id="${product.id}" style="margin-top: var(--spacing-md);">
        <i data-lucide="shopping-cart" style="width: 14px; height: 14px;"></i> ADD TO STASH
      </button>
    </article>
  `;
}

// Global quick-add event binding helper for list components
export function initProductCardListeners() {
  document.querySelectorAll('.quick-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      const added = window.Sketchinity.store.addToCart(id, 1);
      if (added) {
        window.Sketchinity.showToast("Added to your stash!", "success");
        window.Sketchinity.toggleCartDrawer(true); // Pop open the cart drawer!
      }
    });
  });
}
