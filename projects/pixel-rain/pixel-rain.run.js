import {getProperty, waitFor} from '../_helpers/basic.js'
import {draw} from '../_helpers/draw.js'
import {FrameEngine} from '../_helpers/FrameEngine.js'
import {random} from '../_math/basic.js'
import {PixelRainEffect} from '../_glossary/PixelRain.effect.js'

var image = new Image()
image.src = './hacker2.webp'
await waitFor('load', image)

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = image.width;
canvas.height = image.height;

var effect1 = new PixelRainEffect(canvas, image,2)
var fps = 60
var framesEngine = new FrameEngine(fps)
Array(0).fill(0).forEach((_, i) => effect1.update())
framesEngine.addEventListener('frames', e => {
    effect1.update()
    effect1.draw(ctx)
})

function animation (timeStamp) {
    framesEngine.updateFrame(timeStamp)
    requestAnimationFrame(animation)
}

window.requestAnimationFrame(animation);
// window.addEventListener('resize', event => {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     effect1.resize(canvas.width, canvas.height)
//     effect2.resize(canvas.width, canvas.height)
//     effect3.resize(canvas.width, canvas.height)
// })
//
// const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
//
// // recommended method for newer browsers: specify event-type as first argument
// darkModePreference.addEventListener("change", e => {
//     gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
//     gradient.addColorStop(0, getProperty(ctx, '--color-char'));
// });