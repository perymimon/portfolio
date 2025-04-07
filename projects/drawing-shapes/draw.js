import iconsGenerators from './icons-index.js'
import hljs from '../../src/libs/highlight/es/highlight.js'
import javascript from '../../src/libs/highlight/es/languages/javascript.js';

hljs.registerLanguage('javascript', javascript);

var toc = document.getElementById('toc')
var cellSize = 200
var dayes = 24

var fragment = document.createDocumentFragment()

var canvases = Array(dayes).fill(1).map((_, i) => {
    let canvas = document.createElement('canvas');
    canvas.dataset.itemIndex = i
    canvas.width = cellSize;
    canvas.height = cellSize;
    fragment.appendChild(canvas);
    return canvas;
})

// await new Promise(resolve => setTimeout(resolve, 100));

toc.replaceChildren(fragment)


for (let i = 0; i < dayes; i++) {
    let canvas = canvases[i];
    canvas.dataset.itemIndex = i
    snippetSection(i)
    canvas.addEventListener('click', activeDraw)
}

function activeDraw (event) {
    var canvas = event.target;
    var i = canvas.dataset.itemIndex;
    event.preventDefault();
    canvases.forEach((c) => c.classList.remove('active'));
    canvas.classList.add('active')
    var item = iconsGenerators[i]
    if (item) {
        var snippet = document.getElementById(item.name)
        snippet.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'center',
        })
    }

}

export function fillCells (hue) {
    canvases.forEach(canvas => {
        var i = canvas.dataset.itemIndex;
        fillCell(i,canvas, hue)
    })
}

function fillCell (index, canvas, hue  ) {
    hue ??= Math.floor(Math.random() * 360)
    var ctx = canvas.getContext('2d');
    var x = canvas.width / 2;
    var y = canvas.height / 2;
    var itemSize = canvas.width * 0.6;

    var drawItem = iconsGenerators[index]?.draw;
    if (drawItem) {
        drawItem(ctx, x, y, itemSize, hue)

    } else {
        drawNumber(ctx, index + 1, x, y, itemSize);
    }
}

async function snippetSection (index) {
    const item = iconsGenerators[index]
    var template = document.getElementById('code-section-template');
    var sectionFragment = template.content.cloneNode(true)
    var sectionElement = sectionFragment.querySelector('section');
    sectionElement.dataset.index = index;
    if (item) sectionElement.id = item.name;

    var canvas = sectionFragment.querySelector('canvas')
    canvas.width = cellSize
    canvas.height = cellSize
    fillCell(index, canvas)

    if (item) {
        var path = item.filePath
        var drawCode = await fetch(path).then(res => res.text())
        var codeElement = sectionFragment.querySelector('code')
        var coloredCode = hljs.highlight(drawCode.trim(), {language: 'javascript'}).value
            /* add line number */
            .split('\n').map((line, i) => `<span class="line-number">${i + 1}</span> <span>${line}</span>`)
        codeElement.innerHTML = coloredCode.join('\n')
    }
    snippets.append(sectionFragment)

}

function drawNumber (ctx, value, x, y, itemSize) {
    ctx.font = `${itemSize}px Arial`
    ctx.textBaseline = "middle"
    ctx.textAlign = "center"
    ctx.fillText(value, x, y);
}