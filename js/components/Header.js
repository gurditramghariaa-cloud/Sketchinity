export function Header() {
  return `
    <div class="container header-container">
      <!-- Logo with street art spray detail -->
      <a href="#home" class="logo">
        <i data-lucide="palette" style="width: 32px; height: 32px; color: var(--color-primary); stroke-width: 2.5;"></i>
        SKETCH<span>INITY</span>
      </a>

      <!-- Desktop Navigation links -->
      <nav>
        <ul class="nav-links">
          <li><a href="#home" class="active">HOME</a></li>
          <li><a href="#shop">SHOP</a></li>
          <li><a href="#about">ABOUT US</a></li>
          <li><a href="#contact">CONTACT US</a></li>
          <li><a href="#admin">ADMIN</a></li>
        </ul>
      </nav>

      <!-- User profiles and Cart trigger actions -->
      <div class="header-actions">
        <a href="#auth" class="icon-btn" id="header-user-btn" title="My Account / Orders">
          <i data-lucide="user"></i>
        </a>
        
        <button class="icon-btn" id="open-cart-btn" title="View Cart">
          <i data-lucide="shopping-cart"></i>
          <span class="badge" id="cart-count-badge" style="display: none;">0</span>
        </button>
      </div>
    </div>
  `;
}
