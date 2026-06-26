import { store } from '../store.js';
import { ProductCard, initProductCardListeners } from '../components/ProductCard.js';

export function Shop(query) {
  // Store reference to initial filters if passed from URL query parameters
  const initialCategory = query.category || '';
  const initialVibe = query.vibe || '';
  const initialSearch = query.q || '';

  return `
    <div class="container section-padding">
      <div class="shop-layout">
        
        <!-- Sidebar Filter System -->
        <aside class="shop-sidebar">
          <h3 class="shop-sidebar-title">FILTERS</h3>
          
          <!-- Category Filter -->
          <div class="filter-section">
            <h4 class="filter-title">Category</h4>
            <ul class="filter-list">
              <li>
                <label class="checkbox-label">
                  <input type="checkbox" class="category-filter" value="Markers & Pens" ${initialCategory === 'Markers & Pens' ? 'checked' : ''}>
                  Markers & Pens
                </label>
              </li>
              <li>
                <label class="checkbox-label">
                  <input type="checkbox" class="category-filter" value="Sketchbooks" ${initialCategory === 'Sketchbooks' ? 'checked' : ''}>
                  Sketchbooks
                </label>
              </li>
              <li>
                <label class="checkbox-label">
                  <input type="checkbox" class="category-filter" value="Paints & Pigments" ${initialCategory === 'Paints & Pigments' ? 'checked' : ''}>
                  Paints & Pigments
                </label>
              </li>
              <li>
                <label class="checkbox-label">
                  <input type="checkbox" class="category-filter" value="Accessories" ${initialCategory === 'Accessories' ? 'checked' : ''}>
                  Accessories
                </label>
              </li>
            </ul>
          </div>

          <!-- Price Filter -->
          <div class="filter-section">
            <h4 class="filter-title">Max Price</h4>
            <div class="range-wrap">
              <input type="range" class="range-input" id="price-slider" min="0" max="200" step="5" value="200">
              <div class="range-values">
                <span>$0</span>
                <span id="price-slider-value" style="font-weight: 800; color: var(--color-primary);">$200</span>
              </div>
            </div>
          </div>

          <!-- Brand Filter -->
          <div class="filter-section">
            <h4 class="filter-title">Brand</h4>
            <ul class="filter-list">
              <li>
                <label class="checkbox-label">
                  <input type="checkbox" class="brand-filter" value="Molotow">
                  Molotow
                </label>
              </li>
              <li>
                <label class="checkbox-label">
                  <input type="checkbox" class="brand-filter" value="Copic">
                  Copic
                </label>
              </li>
              <li>
                <label class="checkbox-label">
                  <input type="checkbox" class="brand-filter" value="Derwent">
                  Derwent
                </label>
              </li>
              <li>
                <label class="checkbox-label">
                  <input type="checkbox" class="brand-filter" value="Sakura">
                  Sakura
                </label>
              </li>
              <li>
                <label class="checkbox-label">
                  <input type="checkbox" class="brand-filter" value="Sketchinity House">
                  Sketchinity House
                </label>
              </li>
            </ul>
          </div>

          <!-- Vibe Style Filter -->
          <div class="filter-section">
            <h4 class="filter-title">Artist Vibe</h4>
            <ul class="filter-list">
              <li>
                <label class="checkbox-label">
                  <input type="checkbox" class="vibe-filter" value="Street Art" ${initialVibe === 'Street Art' ? 'checked' : ''}>
                  Street Art
                </label>
              </li>
              <li>
                <label class="checkbox-label">
                  <input type="checkbox" class="vibe-filter" value="Fine Art" ${initialVibe === 'Fine Art' ? 'checked' : ''}>
                  Fine Art
                </label>
              </li>
              <li>
                <label class="checkbox-label">
                  <input type="checkbox" class="vibe-filter" value="Illustration" ${initialVibe === 'Illustration' ? 'checked' : ''}>
                  Illustration
                </label>
              </li>
            </ul>
          </div>

          <button id="clear-filters-btn" class="btn btn-secondary btn-sm w-full" style="margin-top: var(--spacing-md);">CLEAR ALL FILTERS</button>
        </aside>

        <!-- Product Listing Content Area -->
        <main class="shop-content">
          <!-- Toolbar (Search & Sort) -->
          <div class="shop-toolbar">
            <div class="search-box">
              <input type="text" id="shop-search-input" placeholder="SEARCH SUPPLIES..." value="${initialSearch}">
              <button id="shop-search-btn">
                <i data-lucide="search" style="width: 18px; height: 18px;"></i>
              </button>
            </div>
            
            <div class="flex items-center gap-sm">
              <label for="shop-sort" style="font-family: var(--font-family-display); font-weight: 800; font-size: 0.9rem; text-transform: uppercase;">Sort by:</label>
              <select id="shop-sort" class="sort-select">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <!-- Active filters notification tags -->
          <div id="active-tags-container" style="display: flex; gap: 8px; flex-wrap: wrap;"></div>

          <!-- Products Grid Target -->
          <div class="products-grid" id="shop-products-grid">
            <!-- Dynamic elements -->
          </div>
        </main>
      </div>
    </div>
  `;
}

// Controller Initialization
Shop.init = function(query) {
  const gridContainer = document.getElementById('shop-products-grid');
  const priceSlider = document.getElementById('price-slider');
  const priceValueLabel = document.getElementById('price-slider-value');
  const searchInput = document.getElementById('shop-search-input');
  const sortSelect = document.getElementById('shop-sort');
  const clearBtn = document.getElementById('clear-filters-btn');
  const activeTagsContainer = document.getElementById('active-tags-container');

  if (!gridContainer) return;

  // Filter application function
  const applyFilters = () => {
    // 1. Gather all checked values
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(el => el.value);
    const selectedBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(el => el.value);
    const selectedVibes = Array.from(document.querySelectorAll('.vibe-filter:checked')).map(el => el.value);
    const maxPrice = Number(priceSlider.value);
    const searchTerm = searchInput.value.toLowerCase().trim();

    // Update Slider UI
    priceValueLabel.textContent = `$${maxPrice}`;

    // 2. Filter products list
    let filteredList = store.products.filter(product => {
      // Category filter check
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }
      // Brand filter check
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }
      // Vibe filter check
      if (selectedVibes.length > 0 && !selectedVibes.includes(product.vibe)) {
        return false;
      }
      // Price limit check
      if (product.price > maxPrice) {
        return false;
      }
      // Search keywords match
      if (searchTerm) {
        const matchesName = product.name.toLowerCase().includes(searchTerm);
        const matchesDesc = product.description.toLowerCase().includes(searchTerm);
        const matchesBrand = product.brand.toLowerCase().includes(searchTerm);
        if (!matchesName && !matchesDesc && !matchesBrand) {
          return false;
        }
      }
      return true;
    });

    // 3. Sort products list
    const sortVal = sortSelect.value;
    if (sortVal === 'price-asc') {
      filteredList.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-desc') {
      filteredList.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'rating') {
      filteredList.sort((a, b) => b.rating - a.rating);
    } // 'featured' keeps original catalog order

    // 4. Render Grid HTML
    if (filteredList.length === 0) {
      gridContainer.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1;">
          <i data-lucide="info" style="width: 48px; height: 48px; margin: 0 auto var(--spacing-sm) auto; color: var(--color-gray-medium);"></i>
          <h3>No Supplies Found</h3>
          <p style="margin-top: 8px;">Try clearing filters or searching for something else.</p>
        </div>
      `;
    } else {
      gridContainer.innerHTML = filteredList.map(product => ProductCard(product)).join('');
    }

    // 5. Update Active Tags visual indicators
    renderFilterTags(selectedCategories, selectedBrands, selectedVibes, maxPrice, searchTerm);

    // Re-bind Lucide icons and item card listeners
    if (window.lucide) {
      window.lucide.createIcons();
    }
    initProductCardListeners();
  };

  const renderFilterTags = (categories, brands, vibes, maxPrice, search) => {
    activeTagsContainer.innerHTML = '';
    
    const tags = [];
    if (categories.length > 0) categories.forEach(v => tags.push({ label: `Category: ${v}`, type: 'category', val: v }));
    if (brands.length > 0) brands.forEach(v => tags.push({ label: `Brand: ${v}`, type: 'brand', val: v }));
    if (vibes.length > 0) vibes.forEach(v => tags.push({ label: `Vibe: ${v}`, type: 'vibe', val: v }));
    if (maxPrice < 200) tags.push({ label: `Max Price: $${maxPrice}`, type: 'price' });
    if (search) tags.push({ label: `Search: "${search}"`, type: 'search' });

    if (tags.length === 0) return;

    activeTagsContainer.innerHTML = tags.map(tag => `
      <span class="badge" style="position: static; font-size: 0.85rem; padding: 4px 10px; height: auto; border-radius: var(--border-radius-sm); border: var(--border-thin); display: inline-flex; align-items: center; gap: 6px; background-color: var(--color-gray-light); color: var(--color-dark); cursor: pointer;" class="filter-tag" data-type="${tag.type}" data-val="${tag.val || ''}">
        ${tag.label} <i data-lucide="x" style="width: 12px; height: 12px;"></i>
      </span>
    `).join('');

    // Bind tag click listener to clear single filters
    activeTagsContainer.querySelectorAll('.badge').forEach(tagEl => {
      tagEl.addEventListener('click', () => {
        const type = tagEl.getAttribute('data-type');
        const val = tagEl.getAttribute('data-val');

        if (type === 'category') {
          const checkbox = document.querySelector(`.category-filter[value="${val}"]`);
          if (checkbox) checkbox.checked = false;
        } else if (type === 'brand') {
          const checkbox = document.querySelector(`.brand-filter[value="${val}"]`);
          if (checkbox) checkbox.checked = false;
        } else if (type === 'vibe') {
          const checkbox = document.querySelector(`.vibe-filter[value="${val}"]`);
          if (checkbox) checkbox.checked = false;
        } else if (type === 'price') {
          priceSlider.value = 200;
        } else if (type === 'search') {
          searchInput.value = '';
        }
        applyFilters();
      });
    });
  };

  // Bind input element events
  priceSlider.addEventListener('input', applyFilters);
  searchInput.addEventListener('input', applyFilters);
  sortSelect.addEventListener('change', applyFilters);
  
  document.querySelectorAll('.category-filter').forEach(cb => cb.addEventListener('change', applyFilters));
  document.querySelectorAll('.brand-filter').forEach(cb => cb.addEventListener('change', applyFilters));
  document.querySelectorAll('.vibe-filter').forEach(cb => cb.addEventListener('change', applyFilters));

  // Search button click
  const searchBtn = document.getElementById('shop-search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', applyFilters);
  }

  // Clear filters button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      document.querySelectorAll('.category-filter:checked').forEach(cb => cb.checked = false);
      document.querySelectorAll('.brand-filter:checked').forEach(cb => cb.checked = false);
      document.querySelectorAll('.vibe-filter:checked').forEach(cb => cb.checked = false);
      priceSlider.value = 200;
      searchInput.value = '';
      sortSelect.value = 'featured';
      applyFilters();
    });
  }

  // Initial trigger
  applyFilters();
};
