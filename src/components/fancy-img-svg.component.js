customElements.define("img-svg", class extends HTMLElement {
    static observedAttributes = ["src"];

    constructor () {super()
        this.style = `display: contents;`
    }

    connectedCallback () {
        if (this.hasAttribute("src")) this.load(this.getAttribute("src"))
    }

    attributeChangedCallback (name, _, newVal) {
        if (name === "src") this.load(newVal)
    }

    async load (url) {
        try {
            const svg = await fetch(url).then(r => r.text())
            this.innerHTML = svg
        } catch (err) {
            this.innerHTML = `<span style="color:var(--color-error);">SVG load error</span>`
        }
    }
});
