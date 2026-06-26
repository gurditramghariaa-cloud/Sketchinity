import { store } from '../store.js';

export function Admin() {
  const productsRows = store.products.map(prod => `
    <tr>
      <td>#${prod.id}</td>
      <td>
        <div style="display: flex; align-items: center; gap: var(--spacing-sm);">
          <div style="width: 40px; height: 40px; border: var(--border-thin); border-radius: var(--border-radius-sm); overflow: hidden; background: var(--color-gray-light); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <img src="${prod.imagePath}" alt="${prod.name}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <span style="font-weight: 700; text-transform: uppercase; font-size: 0.85rem;">${prod.name}</span>
        </div>
      </td>
      <td>${prod.category}</td>
      <td>$${prod.price.toFixed(2)}</td>
      <td>${prod.stock} items</td>
      <td>
        <button class="btn btn-sm delete-prod-btn" data-id="${prod.id}" style="background-color: var(--color-error); border-color: var(--color-error); color: white; padding: 6px 10px;" title="Delete Product">
          <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
        </button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="container section-padding">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-xxl);">
        <h1>STASH ADMIN PORTAL</h1>
        <div style="background-color: var(--color-primary); color: white; padding: 6px 12px; font-weight: 800; font-family: var(--font-family-display); font-size: 0.9rem; border-radius: var(--border-radius-sm); border: var(--border-thin);">
          STORE MANAGER MODE
        </div>
      </div>

      <div class="admin-layout" style="display: grid; grid-template-columns: 1fr 1.5fr; gap: var(--spacing-xl); align-items: start;">
        
        <!-- Left: Form to Add Product -->
        <div class="add-product-box" style="background-color: var(--color-secondary); border: var(--border-thick); border-radius: var(--border-radius-sm); padding: var(--spacing-lg); box-shadow: var(--shadow-medium);">
          <h2 style="font-size: 1.5rem; margin-bottom: var(--spacing-md); border-bottom: var(--border-thin); padding-bottom: var(--spacing-sm);">ADD NEW SUPPLY GEAR</h2>
          
          <form id="admin-add-product-form">
            <div class="form-group">
              <label for="prod-name">PRODUCT NAME *</label>
              <input type="text" id="prod-name" class="input-control" placeholder="e.g. Molotow Premium Neon Set" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
              <div class="form-group">
                <label for="prod-category">CATEGORY *</label>
                <select id="prod-category" class="input-control" style="background-color: var(--color-secondary); cursor: pointer;" required>
                  <option value="Markers & Pens">Markers & Pens</option>
                  <option value="Sketchbooks">Sketchbooks</option>
                  <option value="Paints & Pigments">Paints & Pigments</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div class="form-group">
                <label for="prod-brand">BRAND *</label>
                <input type="text" id="prod-brand" class="input-control" placeholder="e.g. Molotow" required>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
              <div class="form-group">
                <label for="prod-price">PRICE ($) *</label>
                <input type="number" id="prod-price" class="input-control" step="0.01" min="0.10" placeholder="e.g. 29.99" required>
              </div>
              <div class="form-group">
                <label for="prod-stock">STOCK LIMIT *</label>
                <input type="number" id="prod-stock" class="input-control" min="1" placeholder="e.g. 15" required>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
              <div class="form-group">
                <label for="prod-vibe">ARTIST VIBE *</label>
                <select id="prod-vibe" class="input-control" style="background-color: var(--color-secondary); cursor: pointer;" required>
                  <option value="Street Art">Street Art</option>
                  <option value="Fine Art">Fine Art</option>
                  <option value="Illustration">Illustration</option>
                </select>
              </div>
              <div class="form-group" style="display: flex; align-items: center; margin-top: 24px;">
                <label class="checkbox-label" style="cursor: pointer;">
                  <input type="checkbox" id="prod-limited" style="width: 16px; height: 16px; margin-right: 8px; accent-color: var(--color-primary);">
                  LIMITED DROP?
                </label>
              </div>
            </div>

            <div class="form-group">
              <label for="prod-desc">DESCRIPTION *</label>
              <textarea id="prod-desc" class="input-control" placeholder="Describe the supply gears features, pigment quality, thickness, etc." style="height: 80px;" required></textarea>
            </div>

            <div class="form-group">
              <label for="prod-image-file">PRODUCT IMAGE (Optional - Defaults to Blackbook)</label>
              <input type="file" id="prod-image-file" class="input-control" accept="image/*" style="cursor: pointer;">
              <div id="image-preview-box" style="margin-top: var(--spacing-sm); display: none;">
                <img id="image-preview" src="" alt="Selected Preview" style="max-height: 120px; border: var(--border-thin); border-radius: var(--border-radius-sm); object-fit: cover;">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
              <div class="form-group">
                <label for="spec-size">DIMENSIONS / CAPACITY</label>
                <input type="text" id="spec-size" class="input-control" placeholder="e.g. A4 or 400ml">
              </div>
              <div class="form-group">
                <label for="spec-finish">MATERIAL / FINISH</label>
                <input type="text" id="spec-finish" class="input-control" placeholder="e.g. Matte or 220 GSM">
              </div>
            </div>

            <button type="submit" class="btn btn-accent w-full" style="margin-top: var(--spacing-md); display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 0;">
              <i data-lucide="plus-circle"></i> PUBLISH TO CATALOG
            </button>
          </form>
        </div>

        <!-- Right: Catalog Table Management -->
        <div class="admin-products-table-box" style="background-color: var(--color-secondary); border: var(--border-thick); border-radius: var(--border-radius-sm); padding: var(--spacing-lg); box-shadow: var(--shadow-medium); overflow-x: auto;">
          <h2 style="font-size: 1.5rem; margin-bottom: var(--spacing-md); border-bottom: var(--border-thin); padding-bottom: var(--spacing-sm);">CURRENT STASH CATALOG</h2>
          
          <table class="cart-table" style="font-size: 0.85rem; width: 100%;">
            <thead>
              <tr style="background-color: var(--color-dark); color: white;">
                <th style="padding: 10px;">ID</th>
                <th style="padding: 10px;">PRODUCT</th>
                <th style="padding: 10px;">CATEGORY</th>
                <th style="padding: 10px;">PRICE</th>
                <th style="padding: 10px;">STOCK</th>
                <th style="padding: 10px;">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              ${productsRows || '<tr><td colspan="6" class="text-center text-muted" style="padding: 24px;">No products available in database.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

Admin.init = function() {
  const form = document.getElementById('admin-add-product-form');
  const imageFileInput = document.getElementById('prod-image-file');
  const previewBox = document.getElementById('image-preview-box');
  const previewImg = document.getElementById('image-preview');
  const productsTable = document.querySelector('.cart-table');

  let base64ImageString = '';

  // FileReader handler for images
  if (imageFileInput && previewImg && previewBox) {
    imageFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          base64ImageString = evt.target.result;
          previewImg.src = base64ImageString;
          previewBox.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        base64ImageString = '';
        previewBox.style.display = 'none';
      }
    });
  }

  // Submit Product Addition Handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('prod-name').value;
      const category = document.getElementById('prod-category').value;
      const brand = document.getElementById('prod-brand').value;
      const price = parseFloat(document.getElementById('prod-price').value);
      const stock = parseInt(document.getElementById('prod-stock').value);
      const vibe = document.getElementById('prod-vibe').value;
      const isLimited = document.getElementById('prod-limited').checked;
      const description = document.getElementById('prod-desc').value;

      const sizeVal = document.getElementById('spec-size').value;
      const finishVal = document.getElementById('spec-finish').value;

      const specs = {};
      if (sizeVal) specs["Size/Dimensions"] = sizeVal;
      if (finishVal) specs["Finish/Material"] = finishVal;

      const product = {
        id: Date.now(),
        name,
        category,
        price,
        brand,
        vibe,
        description,
        specs,
        rating: 5.0,
        stock,
        isLimited,
        imagePath: base64ImageString || 'images/raw_blackbook_a4.png'
      };

      store.addProduct(product);
      window.Sketchinity.showToast("Product added successfully!", "success");
      
      // Clear forms
      form.reset();
      if (previewBox) previewBox.style.display = 'none';
      base64ImageString = '';
      
      // Re-trigger layout route update
      window.Sketchinity.router.handleRoute();
    });
  }

  // Delete product triggers
  if (productsTable) {
    productsTable.querySelectorAll('.delete-prod-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const prod = store.products.find(p => p.id === Number(id));
        if (prod && confirm(`Are you sure you want to delete "${prod.name}"?`)) {
          store.deleteProduct(id);
          window.Sketchinity.showToast("Product deleted successfully.", "info");
          window.Sketchinity.router.handleRoute();
        }
      });
    });
  }
};
