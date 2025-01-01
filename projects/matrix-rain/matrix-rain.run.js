import {getProperty} from '../../helpers/basic.js'
import {FrameEngine} from '../../helpers/FrameEngine.js'
import {RainEffect} from './matrix-rain.effect.js'

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var  gradient  = ctx.createLinearGradient(0, 0, 0, canvas.height)
gradient.addColorStop(0,  getProperty(ctx, '--color-char'));


var effect3 = new RainEffect(canvas,21)
var effect2 = new RainEffect(canvas,17)
var effect1 = new RainEffect(canvas,7)
var fps = 10
var framesEngine = new FrameEngine(fps)

framesEngine.addEventListener('frames',e=>{
    ctx.fillStyle = `rgba(0,0,0, ${fps/180})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    effect1.draw(ctx, gradient)

    ctx.fillStyle = `rgba(0,0,0, ${fps/180})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    effect2.draw(ctx, gradient)

    ctx.fillStyle = `rgba(0,0,0, ${fps/180})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    effect3.draw(ctx, gradient)
} )

function animation (timeStamp) {
    framesEngine.updateFrame(timeStamp)
    requestAnimationFrame(animation)
}

window.requestAnimationFrame(animation);
window.addEventListener('resize',event=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    effect1.resize(canvas.width, canvas.height)
    effect2.resize(canvas.width, canvas.height)
    effect3.resize(canvas.width, canvas.height)
})