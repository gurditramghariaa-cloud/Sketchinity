import { store } from '../store.js';

export function ProductDetails(query) {
  const productId = Number(query.id);
  const product = store.products.find(p => p.id === productId);

  if (!product) {
    return `
      <div class="container text-center section-padding">
        <h2 class="text-error">PRODUCT NOT FOUND</h2>
        <p class="text-muted" style="margin-top: 16px;">This canvas item seems to have been erased. Let's return to the shop catalog.</p>
        <a href="#shop" class="btn btn-primary" style="margin-top: var(--spacing-md);">GO TO SHOP</a>
      </div>
    `;
  }

  // Generate star icons for average rating
  const avgRating = product.rating;
  const wholeStars = Math.floor(avgRating);
  const hasHalf = avgRating % 1 >= 0.5;
  
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= wholeStars) {
      starsHtml += `<i data-lucide="star" class="filled" style="width: 18px; height: 18px; fill: var(--color-accent); stroke: var(--color-accent);"></i>`;
    } else if (i === wholeStars + 1 && hasHalf) {
      starsHtml += `<i data-lucide="star-half" class="filled" style="width: 18px; height: 18px; fill: var(--color-accent); stroke: var(--color-accent);"></i>`;
    } else {
      starsHtml += `<i data-lucide="star" style="width: 18px; height: 18px; color: var(--color-gray-border);"></i>`;
    }
  }

  // Generate Specs rows
  const specsRows = Object.entries(product.specs || {}).map(([key, val]) => `
    <div class="spec-name uppercase">${key}:</div>
    <div class="spec-value">${val}</div>
  `).join('');

  // Get Reviews
  const reviews = store.getProductReviews(product.id);
  const reviewsHtml = reviews.length === 0 
    ? `<p class="text-muted">No critique has been left for this gear yet. Be the first to leave feedback!</p>`
    : reviews.map(rev => {
        let revStars = '';
        for (let i = 1; i <= 5; i++) {
          revStars += `<i data-lucide="star" class="${i <= rev.rating ? 'filled' : ''}" style="width: 14px; height: 14px; fill: ${i <= rev.rating ? 'var(--color-accent)' : 'none'}; stroke: ${i <= rev.rating ? 'var(--color-accent)' : 'var(--color-gray-border)'};"></i>`;
        }
        return `
          <div class="review-item">
            <div class="review-item-header">
              <span class="review-author">${rev.author}</span>
              <span class="review-artist-badge">${rev.level || 'Student'}</span>
            </div>
            <div style="margin-bottom: 8px;">${revStars}</div>
            <p class="review-content">"${rev.comment}"</p>
          </div>
        `;
      }).join('');

  return `
    <div class="container section-padding">
      <!-- Back Link -->
      <a href="#shop" class="flex items-center gap-sm font-bold uppercase text-primary" style="margin-bottom: var(--spacing-xl);">
        <i data-lucide="arrow-left" style="width: 18px; height: 18px;"></i> BACK TO CATALOG
      </a>

      <!-- Main Layout -->
      <div class="product-detail-layout">
        
        <!-- Left: Image Gallery -->
        <div class="product-detail-images">
          <div class="main-detail-image-wrapper" style="width: 100%; height: 450px; display: flex; align-items: center; justify-content: center; background: var(--color-gray-light); border: var(--border-thick); border-radius: var(--border-radius-sm); box-shadow: var(--shadow-medium); overflow: hidden;">
            <img src="${product.imagePath}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        </div>

        <!-- Right: Info block -->
        <div class="product-detail-info">
          <div class="product-detail-brand">${product.brand}</div>
          <h1>${product.name}</h1>
          
          <div class="product-detail-rating">
            <div class="stars-display" style="display: flex; gap: 4px;">
              ${starsHtml}
            </div>
            <span style="font-weight: 800; font-family: var(--font-family-display); font-size: 1.1rem; color: var(--color-primary);">${product.rating}</span>
            <span style="color: var(--color-gray-medium); font-size: 0.9rem;">(${reviews.length} reviews)</span>
          </div>

          <div class="product-detail-price">$${product.price.toFixed(2)}</div>
          
          <p class="product-detail-desc">${product.description}</p>
          
          <!-- Actions -->
          <div class="detail-actions">
            <div class="detail-qty">
              <button id="qty-dec" class="font-bold">-</button>
              <span id="qty-display">1</span>
              <button id="qty-inc" class="font-bold">+</button>
            </div>
            
            <button id="add-to-stash-btn" class="btn btn-primary flex-grow">
              <i data-lucide="shopping-cart"></i> ADD TO STASH
            </button>
          </div>

          <!-- Specifications -->
          <div class="detail-specs">
            <h3>SPECIFICATIONS</h3>
            <div class="specs-grid">
              ${specsRows}
              <div class="spec-name uppercase">Vibe profile:</div>
              <div class="spec-value">${product.vibe}</div>
              <div class="spec-name uppercase">Stock status:</div>
              <div class="spec-value" style="font-weight: 800; color: ${product.stock > 5 ? 'var(--color-success)' : 'var(--color-error)'};">
                ${product.stock > 5 ? 'In Stash (Ready to Ship)' : `Low Stash (${product.stock} items left)`}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Reviews Section -->
      <section class="reviews-section">
        <div class="reviews-header">
          <h2>STASH CRITIQUE</h2>
          <p class="text-muted">Reviews from artists who have put this gear to the test.</p>
        </div>

        <div class="reviews-grid">
          <!-- Left: Reviews List -->
          <div class="reviews-list">
            ${reviewsHtml}
          </div>

          <!-- Right: Review submission form -->
          <div class="add-review-box">
            <h3>LEAVE A CRITIQUE</h3>
            <p style="font-size: 0.9rem; color: var(--color-gray-dark); margin-bottom: var(--spacing-md);">Your email and identity will not be shared. Fields marked with * are required.</p>
            
            <form id="product-review-form">
              <div class="form-group">
                <label>YOUR STAR RATING *</label>
                <div class="rating-selector" id="review-rating-selector" style="display: flex; gap: 8px;">
                  <i data-rating="1" class="rating-star-btn" data-lucide="star"></i>
                  <i data-rating="2" class="rating-star-btn" data-lucide="star"></i>
                  <i data-rating="3" class="rating-star-btn" data-lucide="star"></i>
                  <i data-rating="4" class="rating-star-btn" data-lucide="star"></i>
                  <i data-rating="5" class="rating-star-btn" data-lucide="star"></i>
                </div>
                <input type="hidden" id="review-rating-value" value="5">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="review-author">Artist Handle *</label>
                  <input type="text" id="review-author" class="input-control" placeholder="e.g. SketchyJoe" required>
                </div>
                
                <div class="form-group">
                  <label for="review-level">Artist Level *</label>
                  <select id="review-level" class="input-control" style="background-color: var(--color-secondary); cursor: pointer;" required>
                    <option value="Student">Student (Learning)</option>
                    <option value="Hobbyist">Hobbyist (Casual)</option>
                    <option value="Pro">Pro Artist (Commercial)</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="review-comment">CRITIQUE DETAILS *</label>
                <textarea id="review-comment" class="input-control" placeholder="How did this paint, markers, or sketch paper hold up? Be honest!" required></textarea>
              </div>

              <button type="submit" class="btn btn-dark w-full">SUBMIT REVIEW</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  `;
}

// Controller Initialization
ProductDetails.init = function(query) {
  const productId = Number(query.id);
  const product = store.products.find(p => p.id === productId);
  if (!product) return;

  // Quantity controls
  const decBtn = document.getElementById('qty-dec');
  const incBtn = document.getElementById('qty-inc');
  const display = document.getElementById('qty-display');
  const addToStashBtn = document.getElementById('add-to-stash-btn');

  let activeQty = 1;

  if (decBtn && incBtn && display) {
    decBtn.addEventListener('click', () => {
      if (activeQty > 1) {
        activeQty--;
        display.textContent = activeQty;
      }
    });

    incBtn.addEventListener('click', () => {
      if (activeQty < product.stock) {
        activeQty++;
        display.textContent = activeQty;
      } else {
        window.Sketchinity.showToast(`Cannot add more than ${product.stock} items (stock limit reached).`, "warning");
      }
    });
  }

  // Add to cart click
  if (addToStashBtn) {
    addToStashBtn.addEventListener('click', () => {
      const added = store.addToCart(product.id, activeQty);
      if (added) {
        window.Sketchinity.showToast(`Added ${activeQty} x ${product.name} to stash!`, "success");
        window.Sketchinity.toggleCartDrawer(true);
      }
    });
  }

  // Star ratings in review form
  const reviewRatingValInput = document.getElementById('review-rating-value');
  const stars = document.querySelectorAll('#review-rating-selector .rating-star-btn');

  if (reviewRatingValInput && stars.length > 0) {
    const updateFormStars = (val) => {
      reviewRatingValInput.value = val;
      stars.forEach(star => {
        const rating = Number(star.getAttribute('data-rating'));
        if (rating <= val) {
          star.classList.add('active');
          star.style.fill = 'var(--color-accent)';
        } else {
          star.classList.remove('active');
          star.style.fill = 'none';
        }
      });
    };

    updateFormStars(5); // Default to 5 stars

    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = Number(star.getAttribute('data-rating'));
        updateFormStars(rating);
      });
    });
  }

  // Submit Review Form
  const reviewForm = document.getElementById('product-review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const author = document.getElementById('review-author').value;
      const rating = Number(reviewRatingValInput.value);
      const level = document.getElementById('review-level').value;
      const comment = document.getElementById('review-comment').value;

      const reviewObj = {
        author,
        rating,
        level,
        comment,
        date: new Date().toLocaleDateString()
      };

      store.submitReview(product.id, reviewObj);
      window.Sketchinity.showToast("Review submitted successfully! Thank you for the critique.", "success");
      
      // Reload current product page to update view
      window.Sketchinity.router.handleRoute();
    });
  }
};
