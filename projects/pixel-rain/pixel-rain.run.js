import {PixelRainEffect} from '../_glossary/effects/PixelRain.effect.js'
import {FrameEngine} from '../_glossary/FrameEngine.js'
import {imageFrom} from '../_helpers/basic.js'
import {getImageData} from '../_helpers/filters.colors.js'

var image = await imageFrom('./hacker2.webp')
// var image = await getImage('../../assets/me.jpg')
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = image.width;
canvas.height = image.height;

var grayscaleImageData = getImageData(image, 'grayscale(1)')

var effect1 = new PixelRainEffect(canvas.width, canvas.height, grayscaleImageData,
    {speed: 6, particleSpacing: 200},
)
var fps = 60
var framesEngine = new FrameEngine(fps, e => {
    effect1.update()
    effect1.draw(ctx, false)
})
framesEngine.start()

// Array(0).fill(0).forEach((_, i) => effect1.update())// Array(0).fill(0).forEach((_, i) => effect1.update())

