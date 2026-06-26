import { store } from '../store.js';
import { Marquee } from '../components/Marquee.js';
import { ProductCard, initProductCardListeners } from '../components/ProductCard.js';

export function Home() {
  // 1. Get Top 4 Best Sellers based on rating
  const bestSellers = [...store.products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  const bestSellersHtml = bestSellers.map(product => ProductCard(product)).join('');

  // 2. Get New Arrivals (using the last 4 products from the database)
  const newArrivals = [...store.products]
    .slice(-4)
    .reverse();
  const newArrivalsHtml = newArrivals.map(product => ProductCard(product)).join('');

  return `
    <!-- 1. Hero Banner Section -->
    <section class="hero-section">
      <div class="container hero-container">
        <div class="hero-text">
          <h1>STREET ART TO STUDIO <br><span>CANVAS CRUSH</span></h1>
          <p>Equipping graffiti writers, traditional sketchers, and studio artists with the rawest pigments, sketchbooks, and design markers in the game.</p>
          <a href="#shop" class="btn btn-accent btn-large">SHOP ALL SUPPLIES</a>
        </div>
        
        <div class="hero-image-wrapper">
          <!-- Real high-quality realistic creative workspace image -->
          <div style="width: 100%; height: 350px; border: var(--border-thick); border-radius: var(--border-radius-md); box-shadow: var(--shadow-orange); overflow: hidden; position: relative;">
            <img src="images/hero_workspace.png?v=3" alt="Sketchinity Creative Workspace" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        </div>
      </div>
    </section>

    <!-- Marquee Component (Scrolling Text below Hero) -->
    ${Marquee()}

    <!-- 2. Product Categories Section -->
    <section class="section-padding container">
      <div class="section-header text-center" style="flex-direction: column; align-items: center; margin-bottom: var(--spacing-xxl);">
        <h2>SHOP BY CATEGORY</h2>
        <p style="margin-top: 8px;">Explore our premium catalog collections tailored for your medium.</p>
      </div>
      
      <div class="vibe-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
        <!-- Cat 1: Markers & Pens -->
        <div class="vibe-card" data-category="Markers & Pens">
          <div style="width: 100%; height: 100%; background: linear-gradient(45deg, #00C6FF, #0072FF); display: flex; align-items: center; justify-content: center;">
            <svg viewBox="0 0 100 100" width="80" height="80">
              <rect x="35" y="15" width="30" height="70" rx="3" fill="#121212"/>
              <polygon points="40,15 50,5 60,15" fill="#FF8C42"/>
              <circle cx="50" cy="45" r="8" fill="#FFFFFF"/>
            </svg>
          </div>
          <div class="vibe-card-overlay">
            <h3>MARKERS & PENS</h3>
            <p>Copic Sketch packs, Sakura technical fineliners, & liquid chrome.</p>
          </div>
        </div>

        <!-- Cat 2: Sketchbooks -->
        <div class="vibe-card" data-category="Sketchbooks">
          <div style="width: 100%; height: 100%; background: linear-gradient(45deg, #1E1E1E, #3A3A3A); display: flex; align-items: center; justify-content: center;">
            <svg viewBox="0 0 100 100" width="80" height="80">
              <rect x="20" y="25" width="60" height="50" rx="4" fill="#121212" stroke="#FFFFFF" stroke-width="2"/>
              <text x="30" y="55" font-family="'Outfit'" font-weight="900" font-size="12" fill="#FF8C42">RAW</text>
            </svg>
          </div>
          <div class="vibe-card-overlay">
            <h3>SKETCHBOOKS</h3>
            <p>Archival-grade heavyweight blackbooks & layflat drawing sheets.</p>
          </div>
        </div>

        <!-- Cat 3: Paints & Pigments -->
        <div class="vibe-card" data-category="Paints & Pigments">
          <div style="width: 100%; height: 100%; background: linear-gradient(45deg, #FF3F3F, #FF8C42); display: flex; align-items: center; justify-content: center;">
            <svg viewBox="0 0 100 100" width="80" height="80">
              <path d="M30 70 L30 30 L50 20 L70 30 L70 70 Z" fill="#121212"/>
              <circle cx="50" cy="45" r="10" fill="#FF8C42"/>
            </svg>
          </div>
          <div class="vibe-card-overlay">
            <h3>PAINTS & PIGMENTS</h3>
            <p>High-pressure spray sets, body acrylics, and watercolor field kits.</p>
          </div>
        </div>

        <!-- Cat 4: Accessories -->
        <div class="vibe-card" data-category="Accessories">
          <div style="width: 100%; height: 100%; background: linear-gradient(45deg, #6C4AB6, #8D72E1); display: flex; align-items: center; justify-content: center;">
            <svg viewBox="0 0 100 100" width="80" height="80">
              <line x1="50" y1="15" x2="30" y2="80" stroke="#121212" stroke-width="3"/>
              <line x1="50" y1="15" x2="70" y2="80" stroke="#121212" stroke-width="3"/>
              <line x1="25" y1="50" x2="75" y2="50" stroke="#FF8C42" stroke-width="3"/>
            </svg>
          </div>
          <div class="vibe-card-overlay">
            <h3>ACCESSORIES</h3>
            <p>Graffiti cap packs, folding aluminum easels, and artist gear bags.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Best Sellers Section -->
    <section class="section-padding container" style="border-top: var(--border-thick);">
      <div class="section-header">
        <div class="section-header-left">
          <h2>BEST SELLERS</h2>
          <p>The street and studio gear trusted by our community.</p>
        </div>
        <a href="#shop" class="btn btn-secondary">VIEW ALL</a>
      </div>
      <div class="products-grid">
        ${bestSellersHtml}
      </div>
    </section>

    <!-- 4. New Arrivals Section -->
    <section class="section-padding container" style="border-top: var(--border-thick);">
      <div class="section-header">
        <div class="section-header-left">
          <h2>NEW ARRIVALS</h2>
          <p>Fresh stock added directly to our inventory stash.</p>
        </div>
        <a href="#shop" class="btn btn-secondary">VIEW ALL</a>
      </div>
      <div class="products-grid">
        ${newArrivalsHtml}
      </div>
    </section>

    <!-- 5. Customer Reviews Section -->
    <section class="section-padding" style="background-color: var(--color-dark); color: var(--color-secondary); border-top: var(--border-thick); border-bottom: var(--border-thick);">
      <div class="container">
        <div class="section-header" style="border-bottom: 2px solid var(--color-gray-dark); padding-bottom: var(--spacing-sm); margin-bottom: var(--spacing-xl);">
          <div class="section-header-left">
            <h2 style="color: var(--color-secondary);">CREATOR CRITIQUE</h2>
            <p style="color: var(--color-gray-medium);">Verified word from the streets and studio spaces.</p>
          </div>
        </div>

        <div class="testimonials-wrapper">
          <div class="testimonials-track">
            <!-- Testimonial 1 -->
            <div class="testimonial-card" style="color: var(--color-dark);">
              <div class="testimonial-user">
                <div class="testimonial-avatar" style="background-color: var(--color-primary-light); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-family: var(--font-family-display);">KM</div>
                <div class="testimonial-info">
                  <h4>Kojo Muralist</h4>
                  <span>Pro Street Artist</span>
                </div>
              </div>
              <p class="testimonial-text">"Sketchinity Raw Blackbooks are the only books that can handle my paint marker saturations without bleeding. Truly heavy duty, and the layflat binding makes scanning easy."</p>
            </div>

            <!-- Testimonial 2 -->
            <div class="testimonial-card" style="color: var(--color-dark);">
              <div class="testimonial-user">
                <div class="testimonial-avatar" style="background-color: var(--color-accent); display: flex; align-items: center; justify-content: center; color: black; font-weight: 900; font-family: var(--font-family-display);">SR</div>
                <div class="testimonial-info">
                  <h4>Siddharth R.</h4>
                  <span>Fine Art Student</span>
                </div>
              </div>
              <p class="testimonial-text">"As a college student, the student bundles save me a ton of cash. Derwent sketching pencils are standard, but buying them here is way cheaper and faster."</p>
            </div>

            <!-- Testimonial 3 -->
            <div class="testimonial-card" style="color: var(--color-dark);">
              <div class="testimonial-user">
                <div class="testimonial-avatar" style="background-color: var(--color-success); display: flex; align-items: center; justify-content: center; color: black; font-weight: 900; font-family: var(--font-family-display);">EC</div>
                <div class="testimonial-info">
                  <h4>Elena Chibi</h4>
                  <span>Hobby Illustrator</span>
                </div>
              </div>
              <p class="testimonial-text">"The Koi Travel Watercolor set has changed my subway routine. I draw sketches on the commute, pop open the water pen, and paint instantly. Ordering from Sketchinity was seamless!"</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Newsletter Subscription Section -->
    <section class="section-padding container">
      <div style="background-color: var(--color-primary); color: var(--color-secondary); border: var(--border-thick); box-shadow: var(--shadow-orange); border-radius: var(--border-radius-md); padding: var(--spacing-xxl); display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: var(--spacing-xl);">
        <div>
          <i data-lucide="mail-open" style="width: 54px; height: 54px; color: var(--color-accent); stroke-width: 2; margin-bottom: var(--spacing-sm);"></i>
          <h2 style="color: var(--color-secondary); font-size: 2.5rem; margin-bottom: var(--spacing-sm); line-height: 1;">JOIN THE CREW</h2>
          <p style="color: var(--color-gray-light); font-size: 1.1rem; max-width: 480px;">Subscribe to get early notifications on limited product drops, special promotional offers, and local community sketch challenges.</p>
        </div>
        
        <div style="background-color: var(--color-dark); border: var(--border-thick); box-shadow: 4px 4px 0 var(--color-accent); padding: var(--spacing-xl); border-radius: var(--border-radius-sm);">
          <form id="home-newsletter-signup-form">
            <div class="form-group">
              <label for="news-email" style="color: var(--color-secondary);">EMAIL ADDRESS</label>
              <input type="email" id="news-email" class="input-control" placeholder="ENTER YOUR EMAIL..." style="background-color: var(--color-dark-soft); color: var(--color-secondary); border-color: var(--color-gray-dark);" required>
            </div>
            
            <button type="submit" class="btn btn-accent w-full" style="margin-top: var(--spacing-sm);">SUBSCRIBE NOW</button>
          </form>
          <p style="font-size: 0.75rem; color: var(--color-gray-medium); text-align: center; margin-top: var(--spacing-md);">No spam. Only raw supply releases. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  `;
}

// Controller Initialization logic
Home.init = function() {
  // Bind Add to Cart listeners
  initProductCardListeners();

  // Setup Categories card click events
  document.querySelectorAll('.vibe-card').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.getAttribute('data-category');
      window.location.hash = `#shop?category=${encodeURIComponent(category)}`;
    });
  });

  // Setup Newsletter Signup Submission
  const newsletterForm = document.getElementById('home-newsletter-signup-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('news-email').value;

      console.log(`Newsletter signup: ${email}`);
      window.Sketchinity.showToast("Signed up successfully! Keep an eye on your inbox.", "success");
      newsletterForm.reset();
    });
  }
};
