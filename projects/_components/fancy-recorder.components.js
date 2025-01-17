import Recorder from "../_glossary/Recorder.js"
import "./toast.componets.js"
/* canvas-recorder */
const componentBaseUrl = new URL(import.meta.url).pathname.replace(/[^/]+$/, '')
const canvasRecorderTemplate = document.createElement('template');
canvasRecorderTemplate.innerHTML = `
   <style>#floating-bar{display:none}</style>
  <link rel="stylesheet" href="${componentBaseUrl}fancy-recorder.components.css">

  <div id="recorder-ui" data-state="idle">
    <button id="record-btn" class="tooltip" role="button" aria-label="Start Recording" >⏺</button>
   <div id="floating-bar" >
        <div class="recording-dot"></div>
        <span id="time">00:00</span>
        <button id="resume-btn" class="tooltip" role="button" aria-label="Resume">▶</button>
        <button id="pause-btn" class="tooltip" role="button" aria-label="Pause">⏸</button>
        <button id="stop-btn" class="tooltip" role="button" aria-label="Stop and download">⏹</button>
    </div>
    
</div>
`;

class RecorderElement extends HTMLElement {
    // Attach Shadow DOM
    shadow = this.attachShadow({mode: 'open'})
    #uniqueId = ''
    #iframeWindow = null

    constructor () {
        super();
        var shadow = this.shadow;
        shadow.appendChild(canvasRecorderTemplate.content.cloneNode(true))

        this.target = null;
        this.ui = shadow.getElementById('recorder-ui');
        this.recordBtn = shadow.getElementById('record-btn');
        this.resumeBtn = shadow.getElementById('resume-btn');
        this.pauseBtn = shadow.getElementById('pause-btn');
        this.stopBtn = shadow.getElementById('stop-btn');
        this.floatingBar = shadow.getElementById('floating-bar');
        this.timeDisplay = shadow.getElementById('time');
        this.#setState('idle')
        this.#setReadyState(false)
    }

    showToast (message) {
        const toast = document.createElement('toast-message');
        toast.setAttribute('message', message);
        document.body.appendChild(toast);
    }

    #setState (state) {
        this.ui.dataset.state = state
    }

    #setReadyState (state) {
        this.ui.dataset.ready = state;
        this.recordBtn.disabled = !Boolean(state);
    }

    connectedCallback () {
        const targetAttr = this.getAttribute('target')
        this.duration = Number(this.getAttribute('duration') || 10_000)

        const [targetId, canvasId] = targetAttr.split(':') ?? []
        // var id = Math.random().toString(36).slice(2, 9);
        this.#uniqueId = `${targetId}-${canvasId || 'default'}`;

        if (targetId) {
            this.target = document.getElementById(targetId)
        } else {
            this.target = document.querySelector('canvas')
            this.showToast(`Recording canvas: #${this.target.id || 'auto-detected'}`)
        }
        if (!this.target)
            throw new Error('CanvasRecorder: No canvas or iframe element found!')

        this.recordBtn.onclick = this.startRecording.bind(this)
        this.resumeBtn.onclick = this.resumeRecording.bind(this)
        this.pauseBtn.onclick = this.pauseRecording.bind(this)
        this.stopBtn.onclick = this.stopRecording.bind(this)

        if (this.target instanceof HTMLCanvasElement) {
            this.attachToLocalTarget()
        }
        if (this.target instanceof HTMLIFrameElement) {
            this.attachToFrameTarget(canvasId)
        }
    }

    attachToFrameTarget (canvasId) {
        this.#iframeWindow = this.target.contentWindow;
        this.target.addEventListener("load", () => {
            this.#sendMessage("stream-requested", {canvasId});
        });
        //todo: when everything work fine . save it end remove it
        window.addEventListener("message", this.#handleMessage.bind(this));
    }

    #sendMessage (type, payload = {}) {
        this.#iframeWindow?.postMessage({type, id: this.#uniqueId, ...payload}, "*");
    }

    #handleMessage (event) {
        const {type, id, canvasId, ...data} = event.data;

        if (id !== this.#uniqueId) return; // Ignore unrelated messages

        switch (type) {
            case "ready":
                this.#setReadyState(true)
                break;
            case "timer-update":
                this.updateTimer(data.time)
                break;
            case "state-update":
                let state = {
                    start: 'recording', pause: 'paused',
                    resume: 'recording', stop: 'idle',
                }[data.state]
                this.#setState(state)
                if (data.state === 'stop') {
                    this.#downloadingRecord(data.url)
                }
                break
            case "not-found":
                this.showToast(`canvas: #${canvasId} not found`, 'error')
                this.#setReadyState(false)
        }
    }

    attachToLocalTarget () {
        this.recorder = new Recorder(this.target)
        this.timerInterval = setInterval(this.updateTimer.bind(this), 1000)


        this.#setReadyState(true)
    }

    disconnectedCallback () {
        clearInterval(this.timerInterval)
    }

    startRecording () {
        if (!this.target) return
        if (this.recorder) {
            this.#setState('recording')
            //todo: get record time as attribute
            this.recorder.record(10000).then(url => {
                this.stopRecording()
                this.#downloadingRecord(url);
            });
            this.showToast('Recording started!')
        } else {
            var {duration} = this
            this.#sendMessage('record', {duration})
        }
    }

    pauseRecording () {
        if (!this.target) return
        if (this.recorder) {
            this.#setState('paused')
            this.recorder.pause();
            this.showToast('Recording paused.')
        } else {
            this.#sendMessage('pause')
        }
    }

    resumeRecording () {
        if (!this.target) return
        if (this.recorder) {
            this.#setState('recording')
            this.recorder.resume()
            this.showToast('Recording resumed.')
        } else {
            this.#sendMessage('resume')
        }

    }

    stopRecording () {
        if (!this.target) return
        if (this.recorder) {
            this.#setState('idle')
            this.recorder?.stop()
        } else {
            this.#sendMessage('stop')
        }
    }

    updateTimer (time) {
        const currentTime = time ?? this.recorder.recodingTime
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

customElements.define('fancy-recorder', RecorderElement)



