import particlesEffect from '../_glossary/effects/particles.effect.js'
import {FrameEngine} from '../_glossary/FrameEngine.js'
import {getProperty, setCanvas} from '../_helpers/basic.js'
import {getLinearGradient} from '../_helpers/cavas.basic.js'
var canvas = document.getElementById("canvas2")
var ctx = canvas.getContext("2d")

// setCanvas(canvas, document.documentElement)
var element = document.getElementById('particles-background')
setCanvas(canvas, element)

var mainElement = document.querySelector('main')
var mainChildren = mainElement.children