import draw from '../_helpers/draw.js'
import {getNearestPoint} from '../_math/math.js'
import Interactive from './Interactive.abstract.js'

export default class Pointer extends Interactive {
    _listeners = {
        pointerdown: this.#onPointerDown.bind(this),
        pointerup: this.#onPointerUp.bind(this),
        pointermove: this.#onPointerMove.bind(this),
        pointercancel: this.#onPointerUp.bind(this),
    }
    doubleTapThreshold = 300 // Time in milliseconds
    swipeThreshold = 100; // Minimum distance in pixels

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
        this.start = {x: 0, y: 0}
        this.swiftStart = {x: 0, y: 0}
        this.interestPoints = []

        // Double tap tracking
        this.lastTapTime = 0;

        // Press tracking
        this.isPointerDown = false;
        this.pressFrameId = null;
        // Swift detection

        this.enable()
        if (getComputedStyle(triggerElement).touchAction !== 'none') {
            console.warn(`trigger element`, triggerElement, `must set touchAction to 'none'`)
        }
    }

    // Public interface methods
    onMove (e, mousePoint) {}

    onRemove (e, targetPoint) {}

    onDrop (e, draggingPoint, hoveredPoint) {}

    onSelected (e, selectedPoint) {}

    onTap (e, tapPoint) {}

    onPress (e, tapPoint) {} // Fires repeatedly while pointer is down
    onDblTap (e, tapPoint) {} // Fires on double tap
    onSwift (e, $) {}

    /* Internals */
    #onPointerMove (e) {
        e.preventDefault();
        this.pointer = {x: e.clientX, y: e.clientY}
        this.delta = {
            x: this.pointer.x - this.swiftStart.x,
            y: this.pointer.y - this.swiftStart.y,
            elapsed: Date.now() - this.timeStart,
            get distance () { return Math.hypot(this.x, this.y) },
            get velocity () { return this.distance / this.elapsed},
            get direction () {
                if (Math.abs(this.x) > Math.abs(this.y))
                    return this.x > 0 ? 'right' : 'left'
                else
                    return this.y > 0 ? 'bottom' : 'up'
            },

        }
        if (this.isPointerDown && this.delta.distance > this.swipeThreshold) {
            this.onSwift(e, this)
            this.swiftStart = this.pointer
        }

        if (this.dragging) {
            this.dragging.x = this.pointer.x;
            this.dragging.y = this.pointer.y;
        }
        this.hovered = getNearestPoint(this.pointer, this.interestPoints, this.hoverThreshold);
        this.onMove(e, this.mouse, this);
    }

    #onPointerDown (e) {
        // Tap event
        // event.button specifies which mouse button was pressed:
        // 0: Left button
        // 1: Middle button
        // 2: Right button

        this.pointer = this.start = this.delta = this.swiftStart =
            {x: e.clientX, y: e.clientY}

        this.timeStart = Date.now()

        this.isPointerDown = true
        this.hovered = getNearestPoint(this.pointer, this.interestPoints, this.hoverThreshold);

        // Double tap logic
        const currentTime = Date.now();
        if (currentTime - this.lastTapTime < this.doubleTapThreshold) {
            this.onDblTap(e, this.pointer, this);
            this.lastTapTime = 0; // Reset to prevent triple taps
        } else {
            this.lastTapTime = currentTime
        }
        // Start press loop
        this.#startPressLoop(e)

        // Selection Logic
        if (this.hovered) {
            this.selected = this.dragging = this.hovered
            this.hovered = null
            this.onSelected(e, this.selected, this)
        } else {
            this.onSelected(e, this.mouse, this)
        }

        this.onTap(e, this.mouse, this)
    }

    #onPointerUp (e) {
        this.isPointerDown = false
        cancelAnimationFrame(this.pressFrameId)
        this.pressFrameId = null

        // if (this.#shouldIgnoreEvent(e)) return
        if (this.dragging) {
            this.onDrop(e, this.dragging, this.hovered, this);
            this.dragging = null;
        }
    }

    #startPressLoop (e) {
        const firePress = () => {
            if (this.isPointerDown) {
                this.onPress(e, this.pointer, this)
                this.pressFrameId = requestAnimationFrame(firePress)
            }
        };
        this.pressFrameId = requestAnimationFrame(firePress);
    }

    #shouldIgnoreEvent (e) {
        // For touch: button is -1, buttons is 0
        // For mouse: respect activeButton (0 = left click)
        return e.pointerType === 'mouse' && e.button !== 0;
    }

    drawDebug (ctx) {
        ctx.save()
        draw.line(ctx, this.start.x, this.start.y, this.pointer.x, this.pointer.y, {
            lineWidth: 2,
            strokeStyle: 'yellow',
        })
        if (this.isPointerDown && this.delta?.distance > this.swipeThreshold) {
            let {x, y} = this.start
            let {x: xd, y: yd} = this.delta
            draw.line(ctx, x, y, x + xd, y + yd, {
                lineWidth: 2,
                strokeStyle: 'green',
            })
        }
        ctx.restore()
    }

}