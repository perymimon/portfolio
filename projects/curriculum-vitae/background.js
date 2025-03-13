import particlesEffect from '../_glossary/effects/particles.effect.js'
import {FrameEngine} from '../_glossary/FrameEngine.js'
import {getProperty, setCanvas} from '../_helpers/basic.js'
import {getLinearGradient} from '../_helpers/cavas.basic.js'
var canvas = document.getElementById("canvas1")
var ctx = canvas.getContext("2d")

// setCanvas(canvas, document.documentElement)
var element = document.getElementById('particles-background')
setCanvas(canvas, element)
var area = canvas.width * canvas.height
const effect = new particlesEffect(canvas, Math.round (area / 7000) )
effect.onResize = ()=>{
    var gradient = getLinearGradient(ctx, 0,0, 0, canvas.height,{
        0:getProperty(ctx, '--bg-stop-1'),
        1:getProperty(ctx, '--bg-stop-2'),
    })
    ctx.fillStyle = gradient
    ctx.strokeStyle = gradient
    ctx.lineWidth = 1
}
effect.onResize()
window.addEventListener("resize", e => {
    let {width, height} =element.getBoundingClientRect()
    effect.resize(width, height)
})


new FrameEngine(10,()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    effect.update()
    effect.draw(ctx)
}).start()