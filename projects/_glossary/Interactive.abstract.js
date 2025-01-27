export default class Interactive {
    _listeners = {}
    triggerElement = window
    enable () { this.#addEventListeners() }

    disable () { this.#removeEventListener() }
    #addEventListeners () {
        for (const [event, handler] of Object.entries(this._listeners)) {
            const isMoveEvent = event === 'pointermove'
            this.triggerElement.addEventListener(event.toLowerCase(), handler, {
                passive: !isMoveEvent // Non-passive for move events
            });
        }

        this.triggerElement.addEventListener('contextmenu', (e) => e.preventDefault())
    }

    #removeEventListener () {
        for (const [event, handler] of Object.entries(this._listeners)) {
            this.triggerElement.removeEventListener(event.toLowerCase(), handler, {passive: true});
        }
    }
}