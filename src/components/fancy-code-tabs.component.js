import {getProperty} from '../helpers/basic.js'
import hljs from '../libs/highlight/es/highlight.js'
import css from '../libs/highlight/es/languages/css.js';
import javascript from '../libs/highlight/es/languages/javascript.js';
import html from '../libs/highlight/es/languages/xml.js';


hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', html)
const componentBaseUrl = new URL(import.meta.url).pathname.replace(/[^/]+$/, '')
// const sheet = await fetch(`${componentBaseUrl}../libs/highlight/styles/github-dark.css`)
//     .then(r => r.text())
//     .then(css => {
//         css = `
//         ::slotted(*){
//             ${css}}
//         `
//         const sheet = new CSSStyleSheet()
//         sheet.replaceSync(css)
//         return sheet
//     })

const template = document.createElement('template')
template.innerHTML = `
<link rel="stylesheet" href="${componentBaseUrl}fancy-code-tabs.component.css">
<div role="tablist">
    <label role="tab"><input name="html" type="checkbox" checked>HTML</label>
    <label role="tab"><input name="css" type="checkbox" checked>CSS</label>
    <label role="tab"><input name="js" type="checkbox" checked>JS</label>
    <div class="right">
        <label role="checkbox" title="Warp"><input class="justify-end" name="soft-warp" type="checkbox" >w</label>
        <label role="tab"><input name="result" type="checkbox" checked>RESULT</label>
    </div>
</div>
<div class="tab-content">
    <pre data-lang="html">
        <slot name="html" ></slot>
    </pre>
    <pre data-lang="css"><slot name="css" ></slot></pre>
    <pre data-lang="js"><slot name="js" ></slot></pre>
    <iframe allowtransparency sandbox="allow-scripts"></iframe>
</div>
`

customElements.define('code-tabs', class extends HTMLElement {
    shadowRoot = this.attachShadow({mode: 'open'})

    constructor () {
        super()
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    connectedCallback () {
        const {shadowRoot} = this;
        const showResult = this.getAttribute("show-result") !== "false"
        const slotKeys = ['html', 'css', 'js']
        const visibleAttr = this.dataset.visible ?? "html css js"
        const visibleSet = new Set(visibleAttr.split(' ').map(v => v.trim()))

        const [html, css, js] = slotKeys.map(key => {
            const present = this.querySelector(`[slot="${key}"]`)
            const [text] = this.highlight(present, key)
            const label$ = shadowRoot.querySelector(`label:has([name=${key}])`)
            const $pre = this.shadowRoot.querySelector(`pre[data-lang=${key}]`)
            if (!text) {
                label$.remove()
                $pre.remove()
                return ''
            }
            label$.querySelector(`input`).checked = visibleSet.has(key)
            $pre.prepend(present)
            return text

        })
        const iframe$ = this.shadowRoot.querySelector("iframe")
        if (!showResult) iframe$.remove()
        else {
            var extraStyle = `body{background:${getProperty(this, '--color-background')};}`
            iframe$.srcdoc = `${html}<style>${extraStyle}\n${css}</style><script>${js}<\/script>`
        }
    }

    highlight (el, language) {
        if (!el) return ''
        const browserEncodedText = el.innerHTML.trim()
        const textArea = document.createElement("textarea")
        textArea.innerHTML = browserEncodedText
        const pureText = textArea.value
        el.innerHTML = hljs.highlight(pureText, {language}).value
        return [pureText]

    }

})