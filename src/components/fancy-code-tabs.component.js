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
<div class="tab-buttons">
    <label ><input name="html" type="checkbox" checked>HTML</label>
    <label ><input name="css" type="checkbox" checked>CSS</label>
    <label ><input name="js" type="checkbox" checked>JS</label>
</div>
<pre class="panes">
<slot name="html" ></slot>
<slot name="css" ></slot>
<slot name="js" ></slot>
<iframe allowtransparency sandbox="allow-scripts"></iframe>
</pre>
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

        const $pre = this.shadowRoot.querySelector('pre')
        const [html, css, js] = slotKeys.map(key => {
            const present = this.querySelector(`[slot="${key}"]`)
            const [text] = this.highlight(present, key)
            const label$ = shadowRoot.querySelector(`label:has([name=${key}])`)
            if (!text) {
                label$.remove()
                shadowRoot.querySelector(`slot[name=${key}]`).remove()
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
        const text = language == 'html'? el.innerHTML.trim(): el.textContent.trim()
        el.innerHTML = hljs.highlight(text, {language}).value
        return [text]

    }

})