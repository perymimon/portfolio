import {Effect} from '../script.js'
import {setCanvas} from '../../../src/helpers/basic.js'
import {drawAlgebra} from '../../../src/helpers/draw.js'
import {angle2P, clamp, distance, exceedsLimits} from '../../../src/math/math.js'

// setup
const canvas = document.getElementById("canvas1");
setCanvas(canvas);
const ctx = canvas.getContext("2d");

const effect = new Effect(canvas);
effect.handleParticles(ctx)
var requestId = null

function animation () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx)

    if(effect.mouse.pressed) {
        for(let i = 0; i < effect.particles.length; i++) {
            if (i % 5) {
                drawAlgebra.line(ctx, this, effect.mouse, {drawStroke: true})
            }
        }
    }

    /* draw circle */
    let m = effect.mouse
    if (m.pressed) {
        ctx.save()
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2, false);
        ctx.globalAlpha = 0.8;
        ctx.fill()
        ctx.stroke()
        ctx.restore()
    }
    requestId =requestAnimationFrame(animation)
}

requestId =requestAnimationFrame(animation)
window.addEventListener("pageswap", (e) =>{
    cancelAnimationFrame(requestId)
})
