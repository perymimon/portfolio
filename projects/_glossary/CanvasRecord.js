const canvasRecorderTemplate = document.createElement('template');
canvasRecorderTemplate.innerHTML = `
  <style>
      :host {
      --primary-color: var(--color-primary, #00ff00);
      --background-color: var(--color-background, #000000);
      --text-color: var(--color-text, #ffffff);
      font-family: 'Courier New', monospace;
      position: relative;
    }

    #floating-bar {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: var(--text-color);
      border-radius: 10px;
      padding: 10px;
      display: none;
      align-items: center;
      gap: 10px;
    }

    button {
      background: var(--primary-color);
      color: var(--background-color);
      border: none;
      border-radius: 5px;
      padding: 5px 10px;
      cursor: pointer;
    }

    button:hover {
      background: #33ff33;
    }
  </style>

  <div id="floating-bar">
    <button id="pause">Pause</button>
    <button id="resume">Resume</button>
    <button id="stop">Stop</button>
  </div>
  <button id="start">Start Recording</button>
`;
class CanvasRecorder extends HTMLElement {
    // Attach Shadow DOM
    shadow = this.attachShadow({ mode: 'open' })
    constructor() {
        super();
        var  shadow = this.shadow;
        shadow.appendChild(canvasRecorderTemplate.content.cloneNode(true))

        this.targetCanvas = null;
        this.floatingBar = shadow.querySelector('#floating-bar');
        this.startButton = shadow.querySelector('#start');
        this.pauseButton = shadow.querySelector('#pause');
        this.resumeButton = shadow.querySelector('#resume');
        this.stopButton = shadow.querySelector('#stop');

        this.mediaRecorder = null;
        this.recordedChunks = [];
    }

    connectedCallback() {
        const canvasId = this.getAttribute('target');
        this.targetCanvas = document.getElementById(canvasId) || document.querySelector('canvas');

        if (this.targetCanvas) {
            this.showToast(`Recording canvas: #${this.targetCanvas.id || 'auto-detected'}`);
        } else {
            throw new Error('CanvasRecorder: No canvas element found!');
        }

        this.startButton.addEventListener('click', () => this.startRecording());
        this.pauseButton.addEventListener('click', () => this.pauseRecording());
        this.resumeButton.addEventListener('click', () => this.resumeRecording());
        this.stopButton.addEventListener('click', () => this.stopRecording());
    }

    showToast(message) {
        const toast = document.createElement('toast-message');
        toast.setAttribute('message', message);
        document.body.appendChild(toast);
    }

    startRecording() {
        if (!this.targetCanvas) return;

        this.recordedChunks = [];
        const stream = this.targetCanvas.captureStream(25);
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.recordedChunks.push(event.data);
            }
        };

        this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'canvas-recording.webm';
            a.click();
        };

        this.mediaRecorder.start();
        this.floatingBar.style.display = 'flex';
        this.startButton.style.display = 'none';
        this.showToast('Recording started!');
    }

    pauseRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.pause();
            this.showToast('Recording paused.');
        }
    }

    resumeRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
            this.mediaRecorder.resume();
            this.showToast('Recording resumed.');
        }
    }

    stopRecording() {
        if (this.mediaRecorder) {
            this.mediaRecorder.stop();
            this.floatingBar.style.display = 'none';
            this.startButton.style.display = 'inline-block';
            this.showToast('Recording stopped.');
        }
    }
}

customElements.define('canvas-recorder', CanvasRecorder);

class ToastMessage extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

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

    connectedCallback() {
        this.messageElement.textContent = this.getAttribute('message') || '';
        setTimeout(() => this.remove(), 3000);
    }
}

customElements.define('toast-message', ToastMessage);
