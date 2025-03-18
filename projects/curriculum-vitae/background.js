import particlesEffect from '../_glossary/effects/particles.effect.js'
import {FrameEngine} from '../_glossary/FrameEngine.js'
import {getProperty, setCanvas} from '../_helpers/basic.js'
import {getLinearGradient} from '../_helpers/cavas.basic.js'

var canvases = Array.from(document.querySelectorAll('#particles-background canvas'))

var ctxes = canvases.map(canvas => canvas.getContext("2d"))

var effects = ctxes.map(ctx => {
    let {canvas} = ctx
    let element = document.getElementById('particles-background')
    setCanvas(canvas, element)
    let area = canvas.width * canvas.height
    const effect = new particlesEffect(canvas, Math.round(area / (7000 * canvases.length) ))
    effect.onResize = () => {


    }
    ctx.lineWidth = 1
    effect.onResize()
    window.addEventListener("resize", e => {
        let {width, height} = element.getBoundingClientRect()
        effect.resize(width, height)
    })
    return effect
})

new FrameEngine(10, () => {
    for(let effect of effects) {
        let {ctx, canvas} = effect
        let gradient = getLinearGradient(ctx, 0, 0, 0, canvas.height, {
            0: getProperty(ctx, '--bg-stop-1'),
            1: getProperty(ctx, '--bg-stop-2'),
        })
        ctx.fillStyle = gradient
        ctx.strokeStyle = gradient
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        effect.update()
        effect.draw(ctx)
    }
}).start()

