/**
 * Giscus Reactions Component
 *
 * A web component that displays and optionally allows interaction with
 * GitHub Discussions reactions via Giscus.
 *
 * Usage:
 * <giscus-reactions
 *   discussion-term="title"
 *   reaction-type="👍"
 *   allow-interaction="true">
 * </giscus-reactions>
 */
// Define the custom element
customElements.define("giscus-reactions", class extends HTMLElement {

    DEFAULT_REACTION_TYPE = 'THUMBS_UP'

    constructor () {
        super()
        this.attachShadow({mode: "open"})

        // Initialize state
        this.state = {
            count: 0,
            userReacted: false,
            loading: true,
            error: null,
            giscusReady: false,
            giscusFrame: null,
        }

        // Configuration
        this.config = {
            discussionTerm: this.getAttribute("discussion-term") || "title",
            reactionType: this.getAttribute("reaction-type") || "👍",
            allowInteraction: this.getAttribute("allow-interaction") !== "false",
            theme: this.getAttribute("theme") || "preferred_color_scheme",
        }

        // Reaction emoji mapping
        this.reactionEmojis = {
            "👍": {emoji: "👍", name: "thumbs up", giscusName: "THUMBS_UP"},
            "👎": {emoji: "👎", name: "thumbs down", giscusName: "THUMBS_DOWN"},
            "😄": {emoji: "😄", name: "laugh", giscusName: "LAUGH"},
            "🎉": {emoji: "🎉", name: "hooray", giscusName: "HOORAY"},
            "😕": {emoji: "😕", name: "confused", giscusName: "CONFUSED"},
            "❤️": {emoji: "❤️", name: "heart", giscusName: "HEART"},
            "🚀": {emoji: "🚀", name: "rocket", giscusName: "ROCKET"},
            "👀": {emoji: "👀", name: "eyes", giscusName: "EYES"},
        }

        // Bind methods
        this.handleGiscusMessage = this.handleGiscusMessage.bind(this)

        // Render initial state
        this.render()
    }

    static get observedAttributes () {
        return ["discussion-term", "reaction-type", "allow-interaction", "theme"]
    }

    attributeChangedCallback (name, oldValue, newValue) {
        if (oldValue === newValue) return

        switch (name) {
            case "discussion-term":
                this.config.discussionTerm = newValue
                break
            case "reaction-type":
                this.config.reactionType = newValue
                break
            case "allow-interaction":
                this.config.allowInteraction = newValue !== "false"
                break
            case "theme":
                this.config.theme = newValue
                break
        }

        this.render()
        // this.initGiscus()
    }

    connectedCallback () {
        // Listen for messages from Giscus iframe
        window.addEventListener("message", this.handleGiscusMessage)

        // Wait for Giscus to be loaded before trying to interact with it
        this.waitForGiscusFrame()
    }

    disconnectedCallback () {
        window.removeEventListener("message", this.handleGiscusMessage)
    }

    waitForGiscusFrame () {
        // Check if Giscus iframe exists
        const checkForFrame = () => {
            const frame = document.querySelector("iframe.giscus-frame")
            if (frame) {
                this.state.giscusFrame = frame
                this.state.giscusReady = true
                // this.initGiscus()
                return true
            }
            return false
        }

        // If frame exists immediately, use it
        if (checkForFrame()) return

        // Otherwise, set up a mutation observer to watch for it
        const observer = new MutationObserver((mutations) => {
            if (checkForFrame()) {
                observer.disconnect()
            }
        })

        // Start observing the document for added nodes
        observer.observe(document.body, {childList: true, subtree: true})

        // Also set a timeout as a fallback
        setTimeout(() => {
            if (!this.state.giscusFrame) {
                console.warn("Giscus frame not found after timeout")
                this.state.error = "Giscus frame not found"
                this.state.loading = false
                this.render()
                observer.disconnect()
            }
        }, 10000) // 10 second timeout
    }

    initGiscus () {
        const {state} = this
        if (!state.giscusReady || !state.giscusFrame) return

        // Request metadata from Giscus
        this.requestGiscusMetadata()
    }

    requestGiscusMetadata () {
        const {state} = this
        if (!state.giscusFrame) return

        try {
            // Request discussion metadata
            const metadataMessage = {
                giscus: {
                    getMetadata: true,
                },
            }

            // Use the correct origin for postMessage
            state.giscusFrame.contentWindow.postMessage(metadataMessage, "https://giscus.app")

            // Set a timeout to handle cases where Giscus doesn't respond
            setTimeout(() => {
                if (state.loading) {
                    state.loading = false
                    this.render()
                }
            }, 5000)
        } catch (error) {
            console.error("Error requesting Giscus metadata:", error)
            state.error = "Failed to communicate with Giscus"
            state.loading = false
            this.render()
        }
    }

    handleGiscusMessage (event) {
        if (event.origin !== "https://giscus.app") return
        if (!event.data?.giscus) return

        const {discussion} = event.data.giscus
        if (!discussion) {
            // this.requestGiscusMetadata()
            return;
        }
        // Handle discussion metadata
        if (discussion) {
            this.state.giscusReady = true
            this.processDiscussionData(discussion)
        }

        // Handle reaction update
        // if (discussion.reactions) {
        //     this.processReactionUpdate(discussion.reactions)
        // }
    }

    processDiscussionData (discussion) {
        if (!discussion) {
            this.state.loading = false
            this.render()
            return
        }
        const type = this.config.reactionType
        // Get reaction counts
        const reactionType = this.reactionEmojis[type]?.giscusName
        if (!reactionType) {
            console.error("Reaction type not found: ", reactionType, 'for', type)
            return
        }
        const {count, viewerHasReacted} = discussion.reactions[reactionType]
        // Update state with reaction count
        this.state.count = count || 0

        this.state.userReacted = viewerHasReacted
        this.state.loading = false
        this.render()
    }

    processReactionUpdate (reaction) {
        if (!reaction) return
        const type = this.config.reactionType
        const reactionType = this.reactionEmojis[type]?.giscusName || this.DEFAULT_REACTION_TYPE

        // If this is an update for our reaction type
        if (reaction.type === reactionType) {
            this.state.count = reaction.count || this.state.count
            this.state.userReacted = reaction.viewerHasReacted || this.state.userReacted
            this.render()
        }
    }

    handleReactionClick () {
        const {state, config, DEFAULT_REACTION_TYPE} = this
        if (!config.allowInteraction || !state.giscusReady || !state.giscusFrame) return

        const reactionType = this.reactionEmojis[config.reactionType]?.giscusName || DEFAULT_REACTION_TYPE
        const action = this.state.userReacted ? "remove" : "add"

        try {
            // Send reaction command to Giscus
            const message = {
                giscus: {
                    setReaction: {
                        type: reactionType,
                        action: action,
                    },
                },
            }

            // Optimistically update UI
            state.userReacted = !state.userReacted
            state.count = state.userReacted ? state.count + 1 : Math.max(0, state.count - 1)
            this.render()

            // Send message to Giscus iframe
            this.state.giscusFrame.contentWindow.postMessage(message, "https://giscus.app")

            // Add animation if adding a reaction
            if (action === "add") {
                this.addReactionAnimation()
            }
        } catch (error) {
            console.error("Error sending reaction to Giscus:", error)
            // Revert optimistic update
            this.state.userReacted = !this.state.userReacted
            this.state.count = !this.state.userReacted ? this.state.count + 1 : Math.max(0, this.state.count - 1)
            this.render()
        }
    }

    addReactionAnimation () {
        const emoji = this.config.reactionType
        const heart = document.createElement("div")
        heart.className = "reaction-animation"
        heart.innerHTML = emoji
        heart.style.position = "absolute"
        heart.style.left = `${Math.random() * 20 + 40}%`
        heart.style.top = `${Math.random() * 20 + 40}%`
        heart.style.fontSize = "2rem"
        heart.style.opacity = "1"
        heart.style.transform = "translateY(0)"
        heart.style.transition = "all 1s ease-out"
        heart.style.zIndex = "1000"
        heart.style.pointerEvents = "none"

        document.body.appendChild(heart)

        setTimeout(() => {
            heart.style.opacity = "0"
            heart.style.transform = "translateY(-100px)"
        }, 50)

        setTimeout(() => {
            document.body.removeChild(heart)
        }, 1000)
    }

    render () {
        const {count, userReacted, loading, error} = this.state
        const {reactionType, allowInteraction} = this.config
        const reaction = this.reactionEmojis[reactionType]
        const {emoji =  "👍", name = "thumbs up"} = reaction

        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
        }
        
        .reaction-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: var(--component-bg, rgba(0, 0, 0, 0.2));
          border: 1px solid var(--component-border, rgba(255, 255, 255, 0.1));
          border-radius: 9999px;
          padding: 0.5rem 1rem;
          color: var(--text-primary, #e0e0e0);
          font-size: 0.875rem;
          transition: all 0.2s ease;
          font-family: var(--font-family-sans-serif, system-ui, sans-serif);
          ${allowInteraction ? "cursor: pointer;" : ""}
        }
        
        .reaction-button:hover {
          ${
            allowInteraction
                ? `
            background-color: var(--component-hover, rgba(0, 0, 0, 0.3));
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          `
                : ""
        }
        }
        
        .reaction-button.reacted {
          background-color: var(--green-shade, rgba(0, 255, 0, 0.1));
          border-color: var(--color-primary, #4ade80);
          color: var(--color-primary, #4ade80);
        }
        
        .reaction-emoji {
          font-size: 1.2em;
          transition: transform 0.2s ease;
        }
        
        .reaction-button:hover .reaction-emoji {
          ${allowInteraction ? "transform: scale(1.2);" : ""}
        }
        
        .reaction-count {
          font-weight: bold;
        }
        
        .reaction-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .error-message {
          color: var(--color-error, #f87171);
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }
      </style>
      
      <button 
        class="reaction-button ${userReacted ? "reacted" : ""}" 
        ?disabled="${loading}"
        aria-label="${userReacted ? `Remove ${name} reaction` : `Add ${name} reaction`}"
        title="${userReacted ? `Remove ${name} reaction` : `Add ${name} reaction`}"
        ${!allowInteraction ? 'tabindex="-1"' : ""}
      >
        <span class="reaction-emoji">${emoji}</span>
        <span class="reaction-count">${loading ? "..." : count}</span>
      </button>
      ${error ? `<div class="error-message">${error}</div>` : ""}
    `

        // Add event listener if interaction is allowed
        if (allowInteraction) {
            this.shadowRoot.querySelector(".reaction-button").addEventListener("click", () => this.handleReactionClick())
        }
    }
})



