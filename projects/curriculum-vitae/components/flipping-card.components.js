const componentBaseUrl = new URL(import.meta.url).pathname.replace(/[^/]+$/, '')
// Create the card structure
const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="${componentBaseUrl}flipping-card.components.css">
  <div class="flip-card-inner" part="inner">
        <div class="flip-card-front" part="front"></div>
        <div class="flip-card-back" part="back"></div>
  </div>
`;

// Register the custom element
customElements.define('flipping-card', class extends HTMLElement {
    constructor() {
        super();
        // Append template content directly to the element
        this.appendChild(template.content.cloneNode(true));
        
        // Get references to front and back containers
        this.frontContainer = this.querySelector('.flip-card-front');
        this.backContainer = this.querySelector('.flip-card-back');
    }

    connectedCallback() {
        // Move all front content
        const frontSlots = this.querySelectorAll('[slot="front"]');
        frontSlots.forEach(slot => {
            this.frontContainer.appendChild(slot);
        });

        // Move all back content
        const backSlots = this.querySelectorAll('[slot="back"]');
        backSlots.forEach(slot => {
            this.backContainer.appendChild(slot);
        });
    }
});