customElements.define('toast-message', class extends HTMLElement {
        constructor() {
            super()
            const shadow = this.attachShadow({mode: 'open'})

            shadow.innerHTML = `
      <style>
        :host {
          position: fixed;
          z-index: var(--z-index-popover);
          bottom: var(--space-4, 20px);
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary-color, #00ff00);
          color: var(--background-color, #000000);
          padding: var(--space-2, 10px);
          border-radius: var(--radius-md, 5px);
          font-family: var(--font-family-base), monospace;
          opacity: 0;
          animation: fadein 0.5s forwards, fadeout 0.5s 2.5s forwards;
        }

        @keyframes fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeout {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      </style>
      <span id="message"></span>
    `

            this.messageElement = shadow.querySelector('#message')
        }

        connectedCallback() {
            this.messageElement.textContent = this.getAttribute('message') || ''
            setTimeout(() => this.remove(), 3000)
        }
    }
)

