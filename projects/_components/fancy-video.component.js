const componentBaseUrl = new URL(import.meta.url).pathname.replace(/[^/]+$/, '')
const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="${componentBaseUrl}fancy-video.component.css">
    <div id="component-ui" class="circle-video-container">
        <a href="#"  data-state="loading">
            <slot name="title"></slot>
            <video loop muted playsinline></video>
          <div class="loader" slot="loader">
            <div class="radar"></div>
          </div>
        </a>
    </div>
`
const IDLE = "idle", LOADING = "loading", ERROR = "error", PLAYING = "playing"
const componentName = 'fancy-video'

class CircularVideo extends HTMLElement {
    // Attach Shadow DOM
    shadow = this.attachShadow({mode: 'open'})

    constructor () {
        super();
        var shadow = this.shadow
        shadow.appendChild(template.content.cloneNode(true))
        this.link = shadow.querySelector('a')
        this.video = shadow.querySelector('video')
        this.ui = shadow.querySelector('#component-ui')
        this.#setState(LOADING)

    }

    #setState (state) {
        this.ui.dataset.state = state
    }

    static get observedAttributes () {
        return ['src', 'href', 'target'];
    }

    connectedCallback () {
        this.#setComponent()
    }

    #setComponent () {
        const {video, link, shadowRoot} = this;
        link.href = this.getAttribute('href') || '#'
        link.href = this.getAttribute('target') || ''

        //todo: better to recreate the video element against to prevent memory leak
        video.src = this.getAttribute('src') || ''
        video.onloadedmetadata = () => video.play()
        video.oncanplay = () => this.#setState(PLAYING)
        // video.ontimeupdate = () => {
        //     let {currentTime, duration} = video
        //     const progress = Math.floor((currentTime / duration) * 360);
        //     this.ui.style.setProperty('--progress', progress);
        // }

        video.onended = () => {
            video.currentTime = 0;
            video.play();
        }
    }

    attributeChangedCallback (name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[name] = newValue;
            if (name === 'src') {
                this.#setState(LOADING)
            }
            this.#setComponent()
        }
    }

    // setupVideo() {
    //     const video = this.shadowRoot.querySelector('video');
    //     const container = this.shadowRoot.querySelector('.circle-video-container');
    //     const loader = this.shadowRoot.querySelector('.loader');
    //
    //
    // }
}

customElements.define(componentName, CircularVideo);