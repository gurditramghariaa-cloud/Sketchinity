export function Footer() {
  return `
    <div class="container">
      <div class="footer-grid">
        <!-- Brand Segment -->
        <div class="footer-brand">
          <h2>SKETCH<span>INITY</span></h2>
          <p>Dripping in inspiration, crafted for creators. Premium artwork gear made for street muralists, fine-art studios, hobbyists, and classroom learners.</p>
          <div class="footer-socials">
            <a href="#" class="social-icon"><i data-lucide="instagram"></i></a>
            <a href="#" class="social-icon"><i data-lucide="twitter"></i></a>
            <a href="#" class="social-icon"><i data-lucide="facebook"></i></a>
            <a href="#" class="social-icon"><i data-lucide="youtube"></i></a>
          </div>
        </div>

        <!-- Sitemap Links -->
        <div class="footer-links">
          <h3>NAVIGATE</h3>
          <ul>
            <li><a href="#home">HOME</a></li>
            <li><a href="#shop">SHOP CATALOG</a></li>
            <li><a href="#about">OUR MISSION</a></li>
            <li><a href="#contact">GET IN TOUCH</a></li>
          </ul>
        </div>

        <!-- Category Shortcuts -->
        <div class="footer-links">
          <h3>STREAMS</h3>
          <ul>
            <li><a href="#shop?category=Markers+%26+Pens">MARKERS & PENS</a></li>
            <li><a href="#shop?category=Sketchbooks">SKETCHBOOKS</a></li>
            <li><a href="#shop?category=Paints+%26+Pigments">PAINTS & PIGMENTS</a></li>
            <li><a href="#shop?category=Accessories">ACCESSORIES</a></li>
          </ul>
        </div>

        <!-- Newsletter panel -->
        <div class="footer-newsletter">
          <h3>JOIN THE CREW</h3>
          <p>Subscribe for limited collection drops, exclusive promo codes, and community artist showcases.</p>
          <form class="footer-newsletter-form" onsubmit="event.preventDefault(); window.Sketchinity.showToast('Subscribed! Check your inbox soon.', 'success'); this.reset();">
            <input type="email" placeholder="ENTER YOUR EMAIL" required />
            <button type="submit">SUBMIT</button>
          </form>
        </div>
      </div>

      <!-- Copyright bottom -->
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} SKETCHINITY ART CO. ALL RIGHTS RESERVED. // MADE FOR CREATORS WORLDWIDE.</p>
      </div>
    </div>
  `;
}
