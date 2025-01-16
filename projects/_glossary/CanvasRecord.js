export default  class CanvasRecorder {
    canvas = null
    fps = 25
    mimeType = "video/webm; codecs=vp9"
    mediaRecorder = null
    pauseTime = 0
    startTime = Date.now()
    constructor (canvas, fps = this.fps ,mimeType = this.mimeType) {
        this.canvas = canvas
        this.fps = fps
        this.mimeType = mimeType
        var stream = canvas.captureStream(fps)
        this.mediaRecorder = new MediaRecorder(stream, {mimeType});
    }
    get recodingTime(){
        if(this.isInactive) return 0;
        return this.pauseTime + this.isPaused ? 0  : Date.now() -this.startTime
    }
    get isPaused(){
        return this.mediaRecorder.state === 'paused'
    }
    get isRecording(){
        return this.mediaRecorder.state === 'recording'
    }
    get isInactive(){
        return this.mediaRecorder.state === 'inactive'
    }
    record (time) {
        var {mediaRecorder} = this
        var recordedChunks = []
        this.startTime = Date.now()
        this.pauseTime = 0
        mediaRecorder.start(time ?? 4000)

        return new Promise(function (res, rej) {
            mediaRecorder.ondataavailable = function (event) {
                recordedChunks.push(event.data)
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop()
                }
            }

            mediaRecorder.onstop = function (event) {
                var blob = new Blob(recordedChunks, {type: "video/webm"})
                var url = URL.createObjectURL(blob)
                res(url)
            }
        })
    }

    pause () {
        if (!this.isRecording || this.isPaused) return
        this.mediaRecorder.pause()
        this.pauseTime += Date.now() - this.startTime
    }
    resume (){
        if(!(this.isRecording && this.isPaused)) return
        this.mediaRecorder.resume()
        this.startTime = Date.now()
    }
    stop(){
        this.mediaRecorder.stop()
    }
}