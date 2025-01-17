export class FrameEngine extends EventTarget {
    #fps = 60
    #canvas = null
    animationIndex = null
    constructor (fps = 60, callback = null, canvas = null) {
        super()
        this.canvas = canvas
        this.lastTimeStamp = null
        this.elapsedTime = 0
        this.frameCounter = 0
        this.fps = fps
        if (callback) {
            this.addEventListener('frames', callback)
        }
    }

    set fps (v) {
        this.#fps = v;
        this.timeframe = 1000 / this.#fps
    }

    set canvas (v) {
        if (!v) return false
        this.#canvas = v
        this.ctx = this.#canvas.getContext('2d')
    }

    updateFrame (timestampe) {
        // Update animation frame based on frameRate
        var deltaTime = timestampe - this.lastTimeStamp
        this.elapsedTime += deltaTime
        this.lastTimeStamp = timestampe
        var frames = Math.floor(this.elapsedTime / this.timeframe)
        this.frameCounter += frames
        this.elapsedTime -= frames * this.timeframe
        if (frames > 0)
            this.#trigger('frames', {frames, ctx: this.ctx})


    }

    #trigger (eventName, details) {
        // Create and dispatch a custom event
        const event = new CustomEvent(eventName, {
            detail: details,
        });
        this.dispatchEvent(event);
    }

    start () {
        if (this.animationIndex) return
        this.animationIndex = window.requestAnimationFrame(animation);
        var framesEngine = this

        function animation (timeStamp) {
            framesEngine.updateFrame(timeStamp)
            framesEngine.animationIndex = requestAnimationFrame(animation)
        }
        return this
    }

    stop () {
        window.cancelAnimationFrame(this.animationIndex)
        this.animationIndex = null
        return this
    }
}