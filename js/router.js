// Single Page Application Router
import { store } from './store.js';
import { Home } from './pages/Home.js?v=3';
import { Shop } from './pages/Shop.js?v=3';
import { ProductDetails } from './pages/ProductDetails.js?v=3';
import { Cart } from './pages/Cart.js?v=3';
import { Checkout } from './pages/Checkout.js?v=3';
import { About } from './pages/About.js?v=3';
import { Contact } from './pages/Contact.js?v=3';
import { Auth } from './pages/Auth.js?v=3';
import { Admin } from './pages/Admin.js?v=4';

const routes = {
  '': Home,
  'home': Home,
  'shop': Shop,
  'product': ProductDetails,
  'cart': Cart,
  'checkout': Checkout,
  'about': About,
  'contact': Contact,
  'auth': Auth,
  'admin': Admin
};

class Router {
  constructor() {
    this.mainContainer = null;
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  init(containerId) {
    this.mainContainer = document.getElementById(containerId);
    this.handleRoute();
  }

  // Parse the current URL hash into path and query object
  parseLocation() {
    const hash = window.location.hash.slice(1) || '';
    const [path, queryString] = hash.split('?');
    
    const query = {};
    if (queryString) {
      const pairs = queryString.split('&');
      for (const pair of pairs) {
        const [key, value] = pair.split('=');
        query[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    }
    
    return { path, query };
  }

  // Navigate to path programmatically
  navigate(hashPath) {
    window.location.hash = hashPath;
  }

  // Route handler
  async handleRoute() {
    const { path, query } = this.parseLocation();
    
    // Find matching view renderer
    const renderer = routes[path] || Home; // Fallback to Home if unmatched

    // Show loading spinner
    if (this.mainContainer) {
      this.mainContainer.innerHTML = `
        <div class="loader-container">
          <div class="spinner"></div>
        </div>
      `;
    }

    // Wait for store initialization
    if (store.initPromise) {
      await store.initPromise;
    }

    if (path === 'admin') {
      await store.loadProducts(); // ensure products loaded
      if (!store.isAdmin) {
        this.mainContainer.innerHTML = `
          <div class="container text-center section-padding">
            <h2 class="text-error">ACCESS DENIED</h2>
            <p class="text-muted" style="margin-top:12px;">Admin access only.</p>
            <a href="#home" class="btn btn-primary" style="margin-top:var(--spacing-md);">GO HOME</a>
          </div>`;
        return;
      }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update navigation active states in the header
    this.updateActiveNavLinks(path);

    try {
      // Execute page render (which returns an HTML string or element)
      const pageHtml = await renderer(query);
      
      if (this.mainContainer) {
        this.mainContainer.innerHTML = pageHtml;
        
        // Setup any event listeners for the page
        if (typeof renderer.init === 'function') {
          renderer.init(query);
        }
      }

      // Re-initialize Lucide Icons for dynamically added elements
      if (window.lucide) {
        window.lucide.createIcons();
      }

    } catch (error) {
      console.error("Routing error: ", error);
      if (this.mainContainer) {
        this.mainContainer.innerHTML = `
          <div class="container text-center section-padding">
            <h2 class="text-error">ERROR 404 / SKETCH CRASH</h2>
            <p class="text-muted" style="margin-top: 16px;">This canvas hasn't been painted yet. Let's return to HQ.</p>
            <a href="#home" class="btn btn-primary" style="margin-top: var(--spacing-md);">GO TO HOME</a>
          </div>
        `;
      }
    }
  }

  updateActiveNavLinks(path) {
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
      const href = link.getAttribute('href').slice(1);
      // Special check for empty string / home
      if ((path === '' || path === 'home') && href === 'home') {
        link.classList.add('active');
      } else if (href === path) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

export const router = new Router();
export default router;
