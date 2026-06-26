export function Marquee() {
  const textItems = [
    "CREATE WITHOUT LIMITS",
    "RAW ART GEAR",
    "LIMITED DROPS LIVE",
    "MOLOTOW // COPIC // SAKURA // DERWENT",
    "FREE SHIPPING OVER $75",
    "STREET TO STUDIO",
    "UNLEASH YOUR CANVASES"
  ];

  // Repeat the array to ensure continuous loop filling the viewport width
  const scrollString = [...textItems, ...textItems, ...textItems].map(text => `
    <div class="marquee-item">${text}</div>
  `).join('');

  return `
    <div class="marquee-container">
      <div class="marquee-content">
        ${scrollString}
      </div>
    </div>
  `;
}
