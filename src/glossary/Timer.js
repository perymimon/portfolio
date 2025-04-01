export default class Timer {
    constructor(duration, callback) {
        this.duration = duration // Timer duration in milliseconds
        this.callback = callback // Function to call when the timer ends
        this.startTime = null // Timestamp when the timer started
        this.remainingTime = duration; // Remaining time in milliseconds
        this.timerId = null // ID for the timeout
        this.isPaused = false // Timer state
    }

    start() {
        if (this.timerId) {
            console.warn("Timer is already running.")
            return;
        }

        this.startTime = Date.now()
        this.timerId = setTimeout(() => {
            this.timerId = null
            this.remainingTime = 0
            if (typeof this.callback === "function") {
                this.callback()
            }
        }, this.remainingTime);
    }

    pause() {
        if (!this.timerId) {
            console.warn("Timer is not running.")
            return
        }

        clearTimeout(this.timerId)
        this.timerId = null
        this.remainingTime -= Date.now() - this.startTime
        this.isPaused = true
    }

    resume() {
        if (this.timerId) {
            console.warn("Timer is already running.")
            return
        }

        if (!this.isPaused) {
            console.warn("Timer is not paused.")
            return
        }

        this.isPaused = false
        this.start()
    }

    stop() {
        if (this.timerId) {
            clearTimeout(this.timerId)
            this.timerId = null
        }
        this.remainingTime = this.duration
        this.isPaused = false
    }

    get currentTime() {
        if (this.timerId) {
            return this.remainingTime - (Date.now() - this.startTime)
        }
        return this.remainingTime
    }
}
