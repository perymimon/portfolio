import {getNearestPoint} from '../_math/2D.math.js'

export default class Mouse {
    #listeners = {
        mousedown: this.#onMouseDown.bind(this),
        mouseup: this.#onMouseUp.bind(this),
        mousemove: this.#onMouseMove.bind(this),
    }

    constructor (triggerElement = window) {
        this.triggerElement = triggerElement
        this.x = 0
        this.y = 0
        this.dragging = null
        this.hovered = null
        this.hoverthreshold = 20
        this.activeButton = 0
        this.mouse = {x: 0, y: 0}
        this.interesetPoints = []
        this.#addEventListeners()
    }

    onMove (e, mousePoint) {}

    onRemove (e, targetPoint) {}

    onDrop (e, draggingPoint, hoveredPoint) {}

    onSelected (e, selectedPoint) {}

    enable () {
        this.#addEventListeners()
    }

    disable () {
        this.#removeEventListener()
    }

    #onMouseMove (e) {
        this.mouse = {x: e.x, y: e.y}
        if (this.dragging) {
            this.dragging.x = this.mouse.x
            this.dragging.y = this.mouse.y
        }
        // check if mouse hover point that is not the one that Dragging
        this.hovered = getNearestPoint(this.mouse, this.interesetPoints, this.hoverthreshold)

        this.onMove(e, this.mouse, this)
    }


    #onMouseDown (e) {
        if (e.button !== this.activeButton) {
            if (this.hovered) {
                this.onSelected(e, this.hovered, this)
                this.selected = this.hovered /*hovered become selected*/
                this.dragging = this.hovered
                this.hovered = null
            } else {
                this.onSelected(e, this.mouse, this)
            }
        } else {
            if (this.selected) return this.selected = null
            if (this.hovered) return this.onRemove(e, this.hovered, this)
        }

    }

    #onMouseUp (e) {
        if (e.button !== this.activeButton) return
        if (this.dragging) {
            if (this.hovered) {
                this.onDrop(e, this.dragging, this.hovered, this)
            }
            this.dragging = null
        }
    }


    #addEventListeners () {
        for (const [event, handler] of Object.entries(this.#listeners)) {
            this.triggerElement.addEventListener(event.toLowerCase(), handler, {passive: true});
        }

        this.triggerElement.addEventListener('contextmenu', (e) => e.preventDefault())
        this.triggerElement.addEventListener('contextmenu', (e) => e.preventDefault())
    }

    #removeEventListener () {
        for (const [event, handler] of Object.entries(this.listeners)) {
            this.triggerElement.removeEventListener(event.toLowerCase(), handler, {passive: true});
        }
    }
}