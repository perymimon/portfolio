import {PixelRainEffectRun} from '../src/glossary/effects/PixelRain.effect.js'
import {imageFrom} from '../src/helpers/basic.js'
import {
    brightnessProcessors,    channels,
    getImageData,    processImageData,    rampUpProcessors,
} from '../src/helpers/filters.colors.js'

var image = await imageFrom('#me-photo')
var canvas = document.getElementById('avatar-canvas')
var imageData = getImageData(image)
imageData = processImageData(imageData, [
    brightnessProcessors()
    , rampUpProcessors('r', 4)
    , channels('rrr'),
])
new PixelRainEffectRun(canvas, imageData, {
    fps: 30, speed: .5, particleSpacing: 40,
    minSize: 1, maxSize: 1,
}).start()