export function About() {
  return `
    <div class="container section-padding">
      <div class="about-header">
        <h1>ABOUT SKETCHINITY</h1>
        <p class="text-muted" style="margin-top: 12px; font-size: 1.25rem; max-width: 600px; margin-left: auto; margin-right: auto;">
          The intersection of raw graffiti culture and precision studio canvas tools.
        </p>
      </div>

      <!-- Creative Visual Workspace Illustration -->
      <div class="about-banner-img-wrapper" style="width: 100%; height: 350px; border: var(--border-thick); border-radius: var(--border-radius-md); box-shadow: var(--shadow-large); margin-bottom: var(--spacing-xxl); overflow: hidden; background: linear-gradient(135deg, #1E1E1E, var(--color-primary-dark)); display: flex; align-items: center; justify-content: center;">
        <svg viewBox="0 0 500 300" width="100%" height="100%">
          <!-- Street art background text -->
          <text x="50" y="100" font-family="'Outfit'" font-weight="900" font-size="50" fill="var(--color-accent)" opacity="0.3">SKETCH</text>
          <text x="180" y="150" font-family="'Outfit'" font-weight="900" font-size="50" fill="#FFFFFF" opacity="0.1">INFINITY</text>
          <!-- Stylized dripping spray nozzle -->
          <path d="M250 80h40v15h-40z" fill="var(--color-accent)"/>
          <circle cx="270" cy="120" r="25" fill="var(--color-primary)"/>
          <!-- Drips -->
          <path d="M255 140v20c0 3 5 3 5 0v-20z" fill="var(--color-primary)"/>
          <path d="M270 145v35c0 5 5 5 5 0v-35z" fill="var(--color-primary)"/>
          <path d="M280 140v15c0 2 3 2 3 0v-15z" fill="var(--color-primary)"/>
        </svg>
      </div>

      <div class="brand-story-grid" style="margin-bottom: var(--spacing-xxl);">
        <div>
          <h2 style="font-size: 2rem; margin-bottom: var(--spacing-md); color: var(--color-primary);">THE REBEL ANCESTRY</h2>
          <p style="margin-bottom: 16px;">We started Sketchinity in 2022 inside a garage full of half-used spray paint and stacked illustration sketchbooks. We noticed a problem: professional artists were paying ridiculous margins for fine-art tools, while students and hobbyists were stuck with cheap supplies that failed to hold ink or blend colors.</p>
          <p style="margin-bottom: 16px;">We decided to break the rules. We formulated sketchbooks that resist bleeding from the heaviest alcohol markers and acrylic brushstrokes. We partnered with Molotow and Copic to bring legendary street markers to students and hobbyists alike. Today, Sketchinity is the primary supplier for mural crews, illustration students, and professional portraitists worldwide.</p>
        </div>
        
        <div style="background-color: var(--color-dark); color: var(--color-secondary); border: var(--border-thick); border-radius: var(--border-radius-sm); padding: var(--spacing-xl); box-shadow: var(--shadow-medium);">
          <h3 style="color: var(--color-accent); font-size: 1.4rem; margin-bottom: var(--spacing-md);">CULTURAL PILLARS</h3>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: var(--spacing-md);">
            <li style="display: flex; gap: 12px;">
              <i data-lucide="zap" style="color: var(--color-accent); flex-shrink: 0;"></i>
              <div>
                <strong>Raw Opacity:</strong> No dilutions. We curate tools that deliver intense pigment on the first pass.
              </div>
            </li>
            <li style="display: flex; gap: 12px;">
              <i data-lucide="globe" style="color: var(--color-accent); flex-shrink: 0;"></i>
              <div>
                <strong>Eco-Minded Refills:</strong> We heavily promote refillable inks and replaceable nibs to reduce trash plastic.
              </div>
            </li>
            <li style="display: flex; gap: 12px;">
              <i data-lucide="shield" style="color: var(--color-accent); flex-shrink: 0;"></i>
              <div>
                <strong>Archival Standards:</strong> Acid-free papers ensure your work doesn't fade or yellow.
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Mission & Vision boxes -->
      <div class="about-mission-grid">
        <div class="mission-box mission-box-primary">
          <h3 style="font-size: 1.6rem; margin-bottom: var(--spacing-sm);">OUR MISSION</h3>
          <p>To democratize premium creative tools. We strive to provide professional-grade pigments, heavy-duty sketchbooks, and precision drawing pens at reasonable prices, ensuring that every artist—from student learners to street legends—can design without limits.</p>
        </div>

        <div class="mission-box mission-box-accent">
          <h3 style="font-size: 1.6rem; margin-bottom: var(--spacing-sm);">OUR VISION</h3>
          <p>To establish a global community network where the line between street art and fine art is permanently dissolved. We envision Sketchinity hubs in every major city, supporting street galleries, student workshops, and sustainable art supply stations.</p>
        </div>
      </div>
    </div>
  `;
}

About.init = function() {
  // Static content, no active selectors needed
};
