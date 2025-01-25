import {getNearestPoint} from '../_math/2D.math.js'
import Interactive from './Interactive.abstract.js'

export default class Pointer extends Interactive {
    _listeners = {
        pointerdown: this.#onPointerDown.bind(this),
        pointerup: this.#onPointerUp.bind(this),
        pointermove: this.#onPointerMove.bind(this),
        pointercancel: this.#onPointerUp.bind(this),
    }

    constructor (triggerElement = window) {
        super()
        this.triggerElement = triggerElement
        this.x = 0
        this.y = 0
        this.dragging = null
        this.hovered = null
        this.hoverThreshold = 20
        this.activeButton = 0
        this.pointer = {x: 0, y: 0}
        this.pointerStart = {x: 0, y: 0}
        this.interestPoints = []
        this.enable()
        if(getComputedStyle(triggerElement).touchAction !== 'none') {
            console.warn(`trigger element`, triggerElement, `not set touchAction to 'none'` )
        }
    }

    // Public interface methods
    onMove (e, mousePoint) {}

    onRemove (e, targetPoint) {}

    onDrop (e, draggingPoint, hoveredPoint) {}

    onSelected (e, selectedPoint) {}
    onTap (e, tapPoint) {}

    /* Internals */

    #onPointerMove (e) {
        e.preventDefault();
        this.pointer = {x: e.clientX, y: e.clientY}
        console.debug('pointer move', this.pointer)
        if (this.dragging) {
            this.dragging.x = this.pointer.x;
            this.dragging.y = this.pointer.y;
        }
        this.hovered = getNearestPoint(this.pointer, this.interestPoints, this.hoverThreshold);
        this.onMove(e, this.mouse, this);
    }

    #onPointerDown (e) {
        // if (this.#shouldIgnoreEvent(e)) return;
        this.pointer = {x: e.clientX, y: e.clientY}
        this.pointerStart = {x: e.clientX, y: e.clientY};
        console.debug('pointer down', this.pointer)
        this.hovered = getNearestPoint(this.pointer, this.interestPoints, this.hoverThreshold);

        if (this.hovered) {
            this.selected = this.dragging = this.hovered;
            this.hovered = null;
            this.onSelected(e, this.selected, this);
        } else {
            this.onSelected(e, this.mouse, this);
        }
        this.onTap(e, this.mouse, this);
    }

    #onPointerUp (e) {
        // if (this.#shouldIgnoreEvent(e)) return;
        console.debug('pointer up', this.pointer)
        if (this.dragging) {
            this.onDrop(e, this.dragging, this.hovered, this);
            this.dragging = null;
        }
    }

    #shouldIgnoreEvent (e) {
        // For touch: button is -1, buttons is 0
        // For mouse: respect activeButton (0 = left click)
        return e.pointerType === 'mouse' && e.button !== 0;
    }

}