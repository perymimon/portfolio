import {FrameEngine} from '../../src/glossary/FrameEngine.js'
import {getProperty} from '../../src/helpers/basic.js'
import {SymbolsRainEffect} from '../../src/glossary/effects/SymbolsRain.effect.js'

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
gradient.addColorStop(0, getProperty(ctx, '--color-char'));


var effect3 = new SymbolsRainEffect(canvas.width, canvas.height, 23)
var effect2 = new SymbolsRainEffect(canvas.width, canvas.height, 17)
var effect1 = new SymbolsRainEffect(canvas.width, canvas.height, 11)
var fps = 10

var framesEngine = new FrameEngine(fps, e => {
    var fillStyle = `hsl(120deg 15% 1% / ${fps / 180})`
    // var fillStyle = `rgba(0,0,0, ${fps / 10})`
    // var fillStyle = getProperty(ctx, '--color-bg');

    ctx.fillStyle = fillStyle
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.shadowColor = 'black'
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1
    ctx.shadowBlur = 1
    effect1.update()
    effect2.update()
    effect3.update()
    ctx.globalAlpha = .9;
    effect1.draw(ctx, gradient)
    effect2.draw(ctx, gradient)
    effect3.draw(ctx, gradient)
    ctx.restore()
})
framesEngine.start()

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