import {PixelRainEffect} from '../_glossary/PixelRain.effect.js'
import {getImage} from '../_helpers/basic.js'
import {FrameEngine} from '../_helpers/FrameEngine.js'

var image = await getImage('./hacker2.webp')

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = image.width;
canvas.height = image.height;
var effect1 = new PixelRainEffect(canvas.width, canvas.height, image, 2, 200)
var fps = 60

var framesEngine = new FrameEngine(fps, e => {
    effect1.update()
    effect1.draw(ctx)
})
framesEngine.start()

// Array(0).fill(0).forEach((_, i) => effect1.update())// Array(0).fill(0).forEach((_, i) => effect1.update())

