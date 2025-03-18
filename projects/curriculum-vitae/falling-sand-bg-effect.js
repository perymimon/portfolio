import {setCanvas} from '../_helpers/basic.js'
import {renderDOMToCanvas} from '../_helpers/draft-html-draw-canvas.js'

var canvas = document.getElementById("canvas2")
var ctx = canvas.getContext("2d")

// setCanvas(canvas, document.documentElement)
var mainElement = document.querySelector('main')

setCanvas(canvas, mainElement)
var h1 = document.querySelector('#main-header h1')

// var mainChildren = mainElement.children
//
// renderDOMToCanvas(mainElement, canvas, 0 , 0 ,{
//     maxDepth:1,
//     debug:false,
//     scaleToFit:false,
//     preserveImages:false,
// })

h1.style.color= 'lightblue'