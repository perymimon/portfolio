import {sparkEffect} from '../_glossary/effects/spark.effect.js'
import {FrameEngine} from '../_glossary/FrameEngine.js'


var cards = document.querySelectorAll('.card')
var effects = []
const observer = new IntersectionObserver(handleIntersection, { threshold: 0.1 });
var seen = new WeakSet()

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if( !seen.has(entry)) {
                effects.push(new sparkEffect(entry.target,{
                    ttl:[10, 15],
                    gap:16
                }))
            }
            seen.add(entry.target)
        }
    })
}

cards.forEach(card => {
    var canvas = document.createElement('canvas')
    canvas.classList.add('hilbert-curve-background-effect')
    card.appendChild(canvas)
    observer.observe(canvas)
})

var fps = 10, sec = 5

new FrameEngine(fps, function ({detail: {frames}}) {
    for (let effect of effects) {
        let {ctx} = effect
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        effect.update(20 / (fps * sec))
        effect.draw()
    }
}).start()
