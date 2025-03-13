export class FrameEngine extends EventTarget {
    #fps = 60
    #canvas = null
    animationIndex = null

    constructor (fps = 60, callback = null, canvas = null) {
        super()
        this.canvas = canvas
        this.lastTimeStamp = null
        this.elapsedTime = 0
        this.frames = 0
        this.fps = fps
        if (callback) {
            this.addEventListener('frames', callback)
        }

        window.addEventListener("pageswap", (e) => this.stop())
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

    updateFrame (timestamp) {
        // Update animation frame based on frameRate
        var deltaTime = timestamp - this.lastTimeStamp
        this.elapsedTime += deltaTime
        this.lastTimeStamp = timestamp
        var elapsedFrames = Math.floor(this.elapsedTime / this.timeframe)
        this.frames += elapsedFrames
        this.elapsedTime -= elapsedFrames * this.timeframe
        var {ctx, frames} = this
        if (elapsedFrames > 0)
            this.#trigger('frames', {elapsedFrames, frames, ctx, timestamp})


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