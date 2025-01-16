export default class ToastMessageElement extends HTMLElement {
    constructor () {
        super();

        const shadow = this.attachShadow({mode: 'open'});

        shadow.innerHTML = `
      <style>
        :host {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary-color, #00ff00);
          color: var(--background-color, #000000);
          padding: 10px;
          border-radius: 5px;
          font-family: 'Courier New', monospace;
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
    `;

        this.messageElement = shadow.querySelector('#message');
    }

    connectedCallback () {
        this.messageElement.textContent = this.getAttribute('message') || '';
        setTimeout(() => this.remove(), 3000);
    }
}
customElements.define('toast-message', ToastMessageElement);
