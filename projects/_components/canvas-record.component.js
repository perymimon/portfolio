import CanvasRecorder from "../_glossary/CanvasRecord.js"
import "./toast.componets.js"
/* canvas-recorder */
const componentBaseUrl = new URL(import.meta.url).pathname.replace(/[^/]+$/, '')
const canvasRecorderTemplate = document.createElement('template');
canvasRecorderTemplate.innerHTML = `
  <link rel="stylesheet" href="${componentBaseUrl}canvas-record.compoents.css">

  <div id="recorder-ui">
    <button id="record-btn" class="tooltip" aria-label="Start Recording" >⏺</button>
   <div id="floating-bar" class="">
        <div class="recording-dot"></div>
        <span id="time">00:00</span>
        <button id="resume-btn" class="tooltip" aria-label="Resume">▶</button>
        <button id="pause-btn" class="tooltip" aria-label="Pause">⏸</button>
        <button id="stop-btn" class="tooltip" aria-label="Stop and download">⏹</button>
    </div>
    
</div>
`;

class CanvasRecorderElement extends HTMLElement {
    // Attach Shadow DOM
    shadow = this.attachShadow({mode: 'open'})

    constructor () {
        super();
        var shadow = this.shadow;
        shadow.appendChild(canvasRecorderTemplate.content.cloneNode(true))

        this.targetCanvas = null;
        this.ui = shadow.getElementById('recorder-ui');
        this.recordBtn = shadow.getElementById('record-btn');
        this.resumeBtn = shadow.getElementById('resume-btn');
        this.pauseBtn = shadow.getElementById('pause-btn');
        this.stopBtn = shadow.getElementById('stop-btn');
        this.floatingBar = shadow.getElementById('floating-bar');
        this.timeDisplay = shadow.getElementById('time');
        this.#setState('idle')
    }

    showToast (message) {
        const toast = document.createElement('toast-message');
        toast.setAttribute('message', message);
        document.body.appendChild(toast);
    }

    connectedCallback () {
        const canvasId = this.getAttribute('target')
        this.targetCanvas = document.getElementById(canvasId) || document.querySelector('canvas')
        if (!this.targetCanvas) throw new Error('CanvasRecorder: No canvas element found!')
        this.showToast(`Recording canvas: #${this.targetCanvas.id || 'auto-detected'}`)

        this.canvasRecorder = new CanvasRecorder(this.targetCanvas)
        this.timerInterval = setInterval(this.updateTimer.bind(this), 1000)

        this.recordBtn.onclick = this.startRecording.bind(this)
        this.resumeBtn.onclick = this.resumeRecording.bind(this)
        this.pauseBtn.onclick = this.pauseRecording.bind(this)
        this.stopBtn.onclick = this.stopRecording.bind(this)
    }

    disconnectedCallback () {
        clearInterval(this.timerInterval)
    }

    startRecording () {
        var {canvasRecorder} = this
        if (!this.targetCanvas) return
        this.recordBtn.disabled = false
        this.#setState('recording')

        canvasRecorder.record(10000).then(url => {
            this.stopRecording()
            this.#downloadingRecord(url);
        });
        this.showToast('Recording started!')
    }

    pauseRecording () {
        if (!this.canvasRecorder?.isRecording) return
        clearInterval(this.timerInterval)
        this.#setState('paused')
        this.canvasRecorder.pause();
        this.showToast('Recording paused.')
    }

    #setState (state) {
        this.ui.dataset.state = state
    }

    resumeRecording () {
        if (!this.canvasRecorder?.isPaused) return
        this.#setState('recording')
        this.canvasRecorder.resume()
        this.showToast('Recording resumed.')
    }

    stopRecording () {
        this.#setState('idle')
        this.canvasRecorder?.stop()
    }

    updateTimer () {
        const currentTime = this.canvasRecorder.recodingTime
        const seconds = Math.floor(currentTime / 1000)
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    #downloadingRecord (url) {
        this.showToast('Downloading record')
        const link = document.createElement('a');
        link.href = url;
        link.download = 'canvas_recording.webm';
        link.click();
    }
}

customElements.define('canvas-recorder', CanvasRecorderElement)



