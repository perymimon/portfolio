import draw from '../_helpers/draw.js'
import {getNearestPoint} from '../_math/math.js'
import Interactive from './Interactive.abstract.js'

export default class Pointer extends Interactive {
    _listeners = {
        pointerdown: this.#onPointerDown.bind(this),
        pointerup: this.#onPointerUp.bind(this),
        pointermove: this.#onPointerMove.bind(this),
        pointercancel: this.#onPointerUp.bind(this),
        pointerenter: this.#onPointerEnter.bind(this),
        pointerleave: this.#onPointerLeave.bind(this),
    }
    doubleTapThreshold = 300 // Time in milliseconds
    swipeThreshold = 100; // Minimum distance in pixels

    constructor (triggerElement = window, touchAction = 'none') {
        super(triggerElement)
        this.dragging = null
        this.hovered = null
        this.hoverThreshold = 20
        this.activeButton = 0
        this.pointer = {x: 0, y: 0, px:0, py:0}
        this.start = {x: 0, y: 0, px:0, py:0}
        this.swiftStart = {x: 0, y: 0}
        this.interestPoints = []
        this.enter = false

        // Double tap tracking
        this.lastTapTime = 0;

        // Press tracking
        this.isPointerDown = false;
        this.pressFrameId = null;
        // Swift detection

        this.enable()
        if (triggerElement.style)
            triggerElement.style.touchAction = touchAction
        else
            window.document.body.style.touchAction = touchAction

        // if (getComputedStyle().touchAction !== 'none') {
        //     console.warn(`trigger element`, triggerElement, `must set touchAction to 'none'`)
        // }
    }

    // Public interface methods
    onMove (pointer, mousePoint) {}

    onRemove (e, targetPoint) {}

    onDrop (e, draggingPoint, hoveredPoint) {}

    onSelected (e, selectedPoint) {}

    onTap (e, tapPoint) {}
    onDown(pointer, e){}
    onUp (pointer, e) {}

    onPress (e, tapPoint) {} // Fires repeatedly while pointer is down
    onDblTap (e, tapPoint) {} // Fires on double tap
    onSwift (e, $) {}

    onEnter (pointer, e) {}
    onLeave (pointer, e) {}

    #onPointerEnter(event){
        this.enter = true
        this.onEnter(this.pointer, this)
    }
    #onPointerLeave(event){
        this.enter = false
        this.onLeave(this.pointer, this)
    }
    /* Internals */
    #onPointerMove (e) {
        console.log('pointer move')
        e.preventDefault()
        this.e = e
        this.pointer = {x: e.offsetX, y: e.offsetY, px:e.pageX, py:e.pageY}
        this.delta = {
            x: this.pointer.px - this.start.px,
            y: this.pointer.py - this.start.py,
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
            this.onSwift(this.pointer, this)
        }

        if (this.dragging) {
            this.dragging.x = this.pointer.x;
            this.dragging.y = this.pointer.y;
        }
        this.hovered = getNearestPoint(this.pointer, this.interestPoints, this.hoverThreshold);
        this.onMove(this.pointer, this);
    }

    #onPointerDown (e) {
        // Tap event
        // event.button specifies which mouse button was pressed:
        // 0: Left button
        // 1: Middle button
        // 2: Right button
        this.e = e
        this.pointer = this.start = this.delta = this.swiftStart = {
            x: e.offsetX,
            y: e.offsetY,
            px:e.pageX,
            py:e.pageY
        }

        this.timeStart = Date.now()

        this.isPointerDown = true
        this.hovered = getNearestPoint(this.pointer, this.interestPoints, this.hoverThreshold);

        // Double tap logic
        const currentTime = Date.now();
        if (currentTime - this.lastTapTime < this.doubleTapThreshold) {
            this.onDblTap(this.pointer, this);
            this.lastTapTime = 0; // Reset to prevent triple taps
        } else {
            this.lastTapTime = currentTime
        }
        // Start press loop
        this.#startPressLoop()

        // Selection Logic
        if (this.hovered) {
            this.selected = this.dragging = this.hovered
            this.hovered = null
            this.onSelected(e, this.selected, this)
        } else {
            this.onSelected(this.pointer, this)
        }

        this.onTap(this.pointer, this)
        this.onDown(this.pointer, this)
    }

    #onPointerUp (e) {
        this.e = e
        this.isPointerDown = false
        cancelAnimationFrame(this.pressFrameId)
        this.pressFrameId = null

        // if (this.#shouldIgnoreEvent(e)) return
        if (this.dragging) {
            this.onDrop(e, this.dragging, this.hovered, this);
            this.dragging = null;
        }
        this.onUp(this.pointer, this)
    }

    #startPressLoop () {
        const firePress = () => {
            if (this.isPointerDown) {
                this.onPress.call(this, this.pointer, this.e, this)
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