import Pointer from '../projects/_glossary/Pointer.js'

var sidebar$ = document.querySelector('#sidebar')
var swipeOverlay = document.querySelector('#swipe-overlay')
window.addEventListener('hashchange', ev => sidebar$.classList.remove('open'))
var toggleThemes = document.getElementById('sidebar-toggle-button')

toggleThemes.addEventListener('click',
    ev => sidebar$.classList.toggle('open'),
)

var pointer = new Pointer(sidebar$, 'pan-y')
pointer.swipeThreshold = 0
pointer.onSwift = function ({x}, {e, delta, start}) {
    sidebar$.style.setProperty('--swipe', delta.x)
    sidebar$.classList.add('touched')

}
const Threshold = 40
pointer.onUp= function ({},{delta}) {
    sidebar$.classList.remove('touched')
    if (delta.x > Threshold) {
        sidebar$.classList.add('open')
    }
    if (delta.x < -Threshold) {
        sidebar$.classList.remove('open')
    }
    sidebar$.style.removeProperty('--swipe')
}
