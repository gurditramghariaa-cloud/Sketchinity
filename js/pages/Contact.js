export function Contact() {
  return `
    <div class="container section-padding">
      <h1 style="margin-bottom: var(--spacing-xxl);">GET IN TOUCH</h1>
      
      <div class="contact-layout">
        <!-- Left: Inquiry Form -->
        <div class="contact-form-container">
          <h2 style="font-size: 1.6rem; margin-bottom: var(--spacing-md); color: var(--color-primary);">SEND US A SIGNAL</h2>
          <p class="text-muted" style="margin-bottom: var(--spacing-lg);">Need custom wholesale supplies? Product questions? Our support crew is active Mon-Fri, 9am-6pm EST.</p>
          
          <form id="contact-main-form">
            <div class="form-row">
              <div class="form-group">
                <label for="contact-name">Your Name *</label>
                <input type="text" id="contact-name" class="input-control" placeholder="e.g. Jane Doe" required>
              </div>
              
              <div class="form-group">
                <label for="contact-email">Email Address *</label>
                <input type="email" id="contact-email" class="input-control" placeholder="e.g. jane@canvas.com" required>
              </div>
            </div>

            <div class="form-group">
              <label for="contact-subject">Topic of Inquiry *</label>
              <select id="contact-subject" class="input-control" style="background-color: var(--color-secondary); cursor: pointer;" required>
                <option value="General">General Inquiry</option>
                <option value="Order Support">Order Tracking & Support</option>
                <option value="Artist Collab">Artist Drops & Collaborations</option>
                <option value="Wholesale">Wholesale & Classroom Supply</option>
              </select>
            </div>

            <div class="form-group">
              <label for="contact-message">Message *</label>
              <textarea id="contact-message" class="input-control" placeholder="Tell us how we can help you..." required></textarea>
            </div>

            <button type="submit" class="btn btn-primary w-full">SEND MESSAGE</button>
          </form>
        </div>

        <!-- Right: Address cards & Map mockup -->
        <div class="contact-info-container">
          
          <!-- Contact Detail Cards -->
          <div class="contact-info-card">
            <div class="contact-info-icon">
              <i data-lucide="mail"></i>
            </div>
            <div class="contact-info-content">
              <h4>Electronic Mail</h4>
              <p style="font-weight: 700; color: var(--color-primary);">support@sketchinity.com</p>
              <p style="font-size: 0.85rem; color: var(--color-gray-dark);">For artist collabs: drops@sketchinity.com</p>
            </div>
          </div>

          <div class="contact-info-card">
            <div class="contact-info-icon">
              <i data-lucide="phone"></i>
            </div>
            <div class="contact-info-content">
              <h4>Voice Line</h4>
              <p style="font-weight: 700; color: var(--color-primary);">+1 (800) 555-ART-SUPP</p>
              <p style="font-size: 0.85rem; color: var(--color-gray-dark);">Mon-Fri // 9:00 AM - 6:00 PM EST</p>
            </div>
          </div>

          <div class="contact-info-card">
            <div class="contact-info-icon">
              <i data-lucide="map-pin"></i>
            </div>
            <div class="contact-info-content">
              <h4>Supply HQ Location</h4>
              <p style="font-weight: 700; color: var(--color-primary);">100 Spray Street, Brooklyn, NY 11201</p>
              <p style="font-size: 0.85rem; color: var(--color-gray-dark);">Stash warehouse pickups by appointment only.</p>
            </div>
          </div>

          <!-- Street Map Mockup representation -->
          <div class="contact-map-mock">
            <svg viewBox="0 0 300 200" width="100%" height="100%" style="position: absolute; top:0; left:0; width:100%; height:100%; z-index: 1;">
              <!-- Grid Roads representation -->
              <rect x="0" y="0" width="300" height="200" fill="var(--color-gray-light)"/>
              <line x1="50" y1="0" x2="50" y2="200" stroke="#FFFFFF" stroke-width="20"/>
              <line x1="200" y1="0" x2="200" y2="200" stroke="#FFFFFF" stroke-width="35"/>
              <line x1="0" y1="100" x2="300" y2="100" stroke="#FFFFFF" stroke-width="25"/>
              <!-- Pin dot -->
              <circle cx="200" cy="100" r="12" fill="var(--color-accent)" stroke="var(--color-dark)" stroke-width="3"/>
              <circle cx="200" cy="100" r="4" fill="#FFFFFF"/>
            </svg>
          </div>

        </div>
      </div>
    </div>
  `;
}

// Controller Initialization
Contact.init = function() {
  const form = document.getElementById('contact-main-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;

      // In mock, log and show success
      console.log(`Inquiry received: ${name} (${email}) - [${subject}] Message: ${message}`);
      
      window.Sketchinity.showToast(`Message sent! Our crew will respond to ${email} shortly.`, "success");
      form.reset();
    });
  }
};
