export class FrameEngine extends EventTarget {
    #fps = 60

    constructor (fps = 60) {
        super()
        this.lastTimeStamp = null
        this.#fps = fps
        this.elapsedTime = 0
        this.frameCounter = 0
        this.timeframe = 1000 / this.#fps
    }

    set fps (v) {
        this.#fps = v;
        this.timeframe = 1000 / this.#fps
    }

    updateFrame (timestampe, callback) {
        // Update animation frame based on frameRate
        var deltaTime = timestampe - this.lastTimeStamp
        this.elapsedTime += deltaTime
        this.lastTimeStamp = timestampe
        var frames = Math.floor(this.elapsedTime / this.timeframe)
        this.frameCounter += frames
        this.elapsedTime -= frames * this.timeframe
        if(frames > 0)
            this.#trigger('frames',{frames})


    }
    #trigger(eventName, details) {
        // Create and dispatch a custom event
        const event = new CustomEvent(eventName, {
            detail: details,
        });
        this.dispatchEvent(event);
    }
}