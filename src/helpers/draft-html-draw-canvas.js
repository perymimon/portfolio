// Canvas HTML Element Renderer
// A simplified utility to draw HTML elements directly on canvas

// Function to render a DOM element to a canvas
export function renderDOMToCanvas(domElement, canvas, x = 0, y = 0, options = {}) {
    // Default options
    const opts = {
        maxDepth: options.maxDepth || Infinity,
        countOnlyVisualElements: options.countOnlyVisualElements !== false,
        width: options.width,
        height: options.height,
        debug: options.debug || false,
        preserveImages: options.preserveImages || false,
        scaleToFit: options.scaleToFit !== false,
        ...options
    }

    // Get the canvas context
    const ctx = canvas.getContext('2d')

    // Clear the canvas if needed
    if (options.clear !== false) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    // Get element dimensions
    const rect = domElement.getBoundingClientRect()

    // Set canvas dimensions to match the element exactly if not already set
    if (opts.scaleToFit && (canvas.width !== rect.width || canvas.height !== rect.height)) {
        canvas.width = rect.width
        canvas.height = rect.height
    }

    const width = opts.width || rect.width
    const height = opts.height || rect.height

    // Set up caches for performance
    const styleCache = new WeakMap()
    const rectCache = new WeakMap()

    // Skip tags (non-visual elements)
    const skipTags = ['SCRIPT', 'STYLE', 'META', 'LINK', 'HEAD', 'TITLE', 'NOSCRIPT']

    // Helper function to get computed style with caching
    function getStyle(element) {
        if (!styleCache.has(element)) {
            styleCache.set(element, window.getComputedStyle(element))
        }
        return styleCache.get(element)
    }

    // Helper function to get bounding client rect with caching
    function getRect(element) {
        if (!rectCache.has(element)) {
            rectCache.set(element, element.getBoundingClientRect())
        }
        return rectCache.get(element)
    }

    // Helper function to check if an element is visual (has background or border)
    function isVisualElement(element) {
        const styles = getStyle(element)
        return styles.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
            styles.backgroundColor !== 'transparent' ||
            parseInt(styles.borderWidth) > 0
    }

    // Helper function to apply text transformations based on CSS
    function applyTextTransform(text, textTransform) {
        switch (textTransform) {
            case 'uppercase':
                return text.toUpperCase()
            case 'lowercase':
                return text.toLowerCase()
            case 'capitalize':
                return text.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
            default:
                return text
        }
    }

    // Helper function to draw an image
    function drawImage(ctx, imgElement, x, y, width, height) {
        try {
            ctx.drawImage(imgElement, x, y, width, height)
        } catch (e) {
            console.error('Error drawing image:', e)

            // Draw a placeholder
            ctx.save()
            ctx.fillStyle = '#ccc'
            ctx.fillRect(x, y, width, height)
            ctx.strokeStyle = '#999'
            ctx.strokeRect(x, y, width, height)
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x + width, y + height)
            ctx.moveTo(x + width, y)
            ctx.lineTo(x, y + height)
            ctx.stroke()
            ctx.restore()
        }
    }

    // Main rendering function using direct text node measurement
    function renderWithTextNodeMeasurement(element, offsetX, offsetY) {
        // Draw background and borders for the main element
        const elementRect = element.getBoundingClientRect()
        const elementX = offsetX
        const elementY = offsetY
        const styles = getStyle(element)

        // Draw element background
        if (styles.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
            styles.backgroundColor !== 'transparent') {
            ctx.fillStyle = styles.backgroundColor
            ctx.fillRect(elementX, elementY, elementRect.width, elementRect.height)
        }

        // Draw element border
        const borderWidth = parseInt(styles.borderWidth) || 0
        if (borderWidth > 0) {
            ctx.strokeStyle = styles.borderColor
            ctx.lineWidth = borderWidth
            ctx.strokeRect(elementX, elementY, elementRect.width, elementRect.height)
        }

        // Debug mode - draw element outlines
        if (opts.debug) {
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'
            ctx.lineWidth = 1
            ctx.strokeRect(elementX, elementY, elementRect.width, elementRect.height)
        }

        // Find all text nodes and their positions directly
        const textPositions = []

        // Function to find text nodes and their positions
        function findTextPositions(node, parentElement) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim()
                if (text) {
                    // Create a range for this text node
                    const range = document.createRange()
                    range.selectNodeContents(node)

                    // Get the bounding client rect for the range
                    const rects = range.getClientRects()

                    // Process each rect (for multi-line text)
                    for (let i = 0; i < rects.length; i++) {
                        const rangeRect = rects[i]

                        // Skip empty rects
                        if (rangeRect.width <= 0 || rangeRect.height <= 0) continue

                        // Calculate position relative to the element
                        const textX = rangeRect.left - elementRect.left
                        const textY = rangeRect.top - elementRect.top

                        textPositions.push({
                            text,
                            x: textX,
                            y: textY,
                            width: rangeRect.width,
                            height: rangeRect.height,
                            parentElement
                        })
                    }
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Skip non-visual elements
                if (skipTags.includes(node.tagName)) {
                    return
                }

                // Process child nodes
                for (let i = 0; i < node.childNodes.length; i++) {
                    findTextPositions(node.childNodes[i], node)
                }
            }
        }

        // Find all text positions
        findTextPositions(element, element)

        // Check if we need to adjust vertical alignment
        const elementStyles = getStyle(element)
        const verticalAlign = elementStyles.verticalAlign || 'baseline'
        const textAlign = elementStyles.textAlign || 'left'

        // Group text positions by their parent elements
        const textByParent = {}
        textPositions.forEach(pos => {
            const parentKey = pos.parentElement.tagName + '_' + Array.from(pos.parentElement.classList).join('_')
            if (!textByParent[parentKey]) {
                textByParent[parentKey] = []
            }
            textByParent[parentKey].push(pos)
        })

        // Process each group of text positions
        Object.values(textByParent).forEach(positions => {
            // Find the top and bottom of this text group
            let minY = Infinity
            let maxY = -Infinity
            let totalHeight = 0

            positions.forEach(pos => {
                minY = Math.min(minY, pos.y)
                maxY = Math.max(maxY, pos.y + pos.height)
                totalHeight += pos.height
            })

            // Get the parent element of the first position (they all have the same parent)
            const parentElement = positions[0].parentElement
            const parentStyles = getStyle(parentElement)
            const parentRect = getRect(parentElement)

            // Check if we need to adjust vertical alignment
            let verticalOffset = 0

            // Check if the parent has specific vertical alignment
            const parentVerticalAlign = parentStyles.verticalAlign || verticalAlign

            if (parentVerticalAlign === 'middle' || textAlign === 'center') {
                // Calculate the vertical center of the parent element
                const parentCenter = parentRect.height / 2

                // Calculate the vertical center of the text group
                const textCenter = (maxY - minY) / 2 + minY

                // Calculate the offset to center the text
                verticalOffset = parentCenter - textCenter
            }

            // Render each text position in this group
            positions.forEach(pos => {
                // Apply text transform
                let text = pos.text
                if (parentStyles.textTransform) {
                    text = applyTextTransform(text, parentStyles.textTransform)
                }

                // Set text styles
                ctx.save()
                ctx.fillStyle = parentStyles.color

                // Set font
                const fontSize = parseFloat(parentStyles.fontSize)
                const fontWeight = parentStyles.fontWeight
                const fontStyle = parentStyles.fontStyle
                const fontFamily = parentStyles.fontFamily

                ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`

                // Measure text to get baseline info
                const metrics = ctx.measureText(text)
                const fontAscent = metrics.actualBoundingBoxAscent || (fontSize * 0.7)

                // Draw text at the correct position with vertical alignment adjustment
                ctx.textBaseline = 'alphabetic'
                ctx.textAlign = 'left'

                // Calculate the baseline position with vertical alignment
                const baselineY = elementY + pos.y + fontAscent + verticalOffset

                ctx.fillText(text, elementX + pos.x, baselineY)

                // Debug: draw text bounding box
                if (opts.debug) {
                    ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)'
                    ctx.strokeRect(elementX + pos.x, elementY + pos.y + verticalOffset, pos.width, pos.height)
                }

                ctx.restore()
            })
        })

        // Handle images
        if (opts.preserveImages) {
            const images = element.querySelectorAll('img')
            images.forEach(img => {
                const imgRect = img.getBoundingClientRect()
                const imgX = imgRect.left - elementRect.left
                const imgY = imgRect.top - elementRect.top

                drawImage(
                    ctx,
                    img,
                    elementX + imgX,
                    elementY + imgY,
                    imgRect.width,
                    imgRect.height
                )
            })
        }
    }

    // Start rendering from the root element
    renderWithTextNodeMeasurement(domElement, x, y)

    return {
        width,
        height
    }
}

// Example usage
console.log(`
// Canvas HTML Element Renderer

// Example usage:
import { renderDOMToCanvas } from './canvas-html-renderer.js'

const domElement = document.querySelector('header')
const canvas = document.getElementById('headerCanvas')

// Basic usage
renderDOMToCanvas(domElement, canvas, 0, 0)

// With options
renderDOMToCanvas(domElement, canvas, 0, 0, {
  debug: true,                      // Set to true to see element boundaries
  preserveImages: false             // Don't render images by default
})
`)