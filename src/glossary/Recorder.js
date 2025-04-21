import EventsEmitter from './EventsEmitter.js'
import {FrameEngine} from './FrameEngine.js'
import Timer from './Timer.js'

window.addEventListener("message", async (event) => {
    const {type, id, canvasId} = event.data
    const {source} = event

    if (type === "stream-requested") {
        const targetCanvas =
            canvasId ? document.getElementById(canvasId) : document.querySelector("canvas")

        if (!targetCanvas) {
            console.error(`CanvasRecorder: Target canvas not exist.`)
            // source.postMessage({type: "not-found", id, canvasId}, "*")
            return
        }
        const recorder = new Recorder(targetCanvas)
        var fps = new FrameEngine(2, _ => {
            source.postMessage({
                type: "timer-update",
                id,
                time: recorder.recodingTime,
            })
        })

        source.postMessage({type: "ready", id}, "*")

        function sendState (state, url) {
            source.postMessage({type: "state-update", id, state, url})
        }

        function eventFactory (fpsAction) {
            return function (event) {
                sendState(event.type, event.detail?.url)
                fps[fpsAction]()
            }
        }

        recorder.addEventListener('start', eventFactory('start'))
        recorder.addEventListener('pause', eventFactory('stop'))
        recorder.addEventListener('stop', eventFactory('stop'))
        recorder.addEventListener('resume', eventFactory('start'))

        window.addEventListener("message", ({data, origin}) => {
            if (data.id !== id) return
            recorder[data.type](Number(data.duration))
        })
    }
})


export default class Recorder extends EventsEmitter {
    canvas = null
    fps = 30
    // mimeType = "video/webm codecs=vp9"
    mimeType = "video/mp4; codecs=avc3" // Use H.264
    mediaRecorder = null
    videoBitsPerSecond = 288000

    constructor (canvas, fps, mimeType, videoBitsPerSecond) {
        super()
        if (fps) this.fps = fps
        if (mimeType) this.mimeType = mimeType
        if (videoBitsPerSecond) this.videoBitsPerSecond = videoBitsPerSecond
        this.canvas = canvas
        this.fps = fps
        var stream = canvas.captureStream(fps)
        this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: this.mimeType,
            videoBitsPerSecond: this.videoBitsPerSecond,
        })

        this.mediaRecorder.onstart = e => this.emit(e)
        this.mediaRecorder.onpause = e => this.emit(e)
        this.mediaRecorder.onresume = e => this.emit(e)
    }

    get recodingTime () {
        if (this.timer) return this.timer.currentTime
        return 0
    }

    get isPaused () {
        return this.mediaRecorder.state === 'paused'
    }

    get isRecording () {
        return this.mediaRecorder.state === 'recording'
    }

    get isInactive () {
        return this.mediaRecorder.state === 'inactive'
    }

    record (time = 10_000) {
        if (!this.isInactive) return
        var recordedChunks = []

        this.timer = new Timer(time, _ => this.mediaRecorder.stop())
        this.mediaRecorder.start()
        this.timer.start()
        var {promise, resolve, reject} = Promise.withResolvers()

        this.mediaRecorder.ondataavailable = (event) => {
            recordedChunks.push(event.data)
        }

        this.mediaRecorder.onstop = (event) => {
            var blob = new Blob(recordedChunks, {type: "video/webm"})
            var url = URL.createObjectURL(blob)
            resolve(url)
            this.emit(event, {url})
        }

        return promise
    }

    pause () {
        if (this.isPaused || this.isInactive) return
        this.mediaRecorder.pause()
        this.timer?.pause()
    }

    resume () {
        if (!this.isPaused) return
        this.mediaRecorder.resume()
        this.timer?.resume()
    }

    stop () {
        this.mediaRecorder.stop()
        this.timer?.stop()
    }
}