import {FrameEngine} from '../_glossary/FrameEngine.js'
import {getProperty} from '../_helpers/basic.js'
import {RainEffect} from '../_glossary/effects/matrix-rain.effect.js'

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
gradient.addColorStop(0, getProperty(ctx, '--color-char'));


var effect3 = new RainEffect(canvas, 23)
var effect2 = new RainEffect(canvas, 17)
var effect1 = new RainEffect(canvas, 11)
var fps = 10
var framesEngine = new FrameEngine(fps)

framesEngine.addEventListener('frames', e => {
    var fillStyle = `hsl(120deg 15% 1% / ${fps/180})`
    // var fillStyle = `rgba(0,0,0, ${fps / 10})`
    // var fillStyle = getProperty(ctx, '--color-bg');

    ctx.fillStyle = fillStyle
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.shadowColor = 'black'
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1
    ctx.shadowBlur = 1
    effect1.draw(ctx, gradient)
    effect2.draw(ctx, gradient)
    effect3.draw(ctx, gradient)
    ctx.restore()
})

function animation (timeStamp) {
    framesEngine.updateFrame(timeStamp)
    requestAnimationFrame(animation)
}

window.requestAnimationFrame(animation);
window.addEventListener('resize', event => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    effect1.resize(canvas.width, canvas.height)
    effect2.resize(canvas.width, canvas.height)
    effect3.resize(canvas.width, canvas.height)
})

const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");

// recommended method for newer browsers: specify event-type as first argument
darkModePreference.addEventListener("change", e => {
    gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, getProperty(ctx, '--color-char'));
});