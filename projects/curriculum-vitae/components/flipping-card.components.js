const componentBaseUrl = new URL(import.meta.url).pathname.replace(/[^/]+$/, '')
// Create the card structure
const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="${componentBaseUrl}flipping-card.components.css">
  <div class="flip-card-inner" part="inner">
    <div class="flip-card-front" part="front">
      <slot name="front" ></slot>
    </div>
    <div class="flip-card-back" part="back">
      <slot name="back" ></slot>
    </div>
  </div>
`;

// Register the custom element
customElements.define('flipping-card', class extends HTMLElement {
    constructor() {
        super();
        // Create shadow DOM
        this.attachShadow({ mode: 'open' });
        // Append to shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
});