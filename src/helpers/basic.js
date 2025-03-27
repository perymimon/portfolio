export function getProperty (ctx, property) {
    if (String(property).startsWith('--')) {
        var {canvas} = ctx;
        var value = getComputedStyle(canvas).getPropertyValue(property).trim()
        // Check for light-dark function
        if (value.startsWith('light-dark(')) {
            value = parseLightDark(value);
        }
        return value
    }
    return property;
}

// Function to parse and evaluate light-dark values
function parseLightDark (value) {
    // Match the light-dark function and its parameters
    const match = value.match(/light-dark\(\s*((?:[^\(\)]|\([^)]*\))+)\s*,\s*((?:[^\(\)]|\([^)]*\))+)\s*\)$/);
    if (!match) return value; // Return as-is if no match

    const [, lightValue, darkValue] = match
    // Detect light or dark mode (customize this logic for your environment)
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Return the appropriate value
    return isDarkMode ? darkValue : lightValue;
}

export async function waitFor (eventName, element) {
    const {promise, resolve, reject} = Promise.withResolvers()
    try {
        element.addEventListener(eventName, resolve, {ones: true});
    } catch (e) {
        reject(e);
    }
    return promise;
}

/**
 * image can be image instance, dom img element, url , css selector
 * */
export async function imageFrom (imageLike) {
    var image = null
    if (typeof imageLike == 'string') {
        if (isUrl(imageLike)) {
            var url = imageLike
            image = new Image()
            image.src = url
        } else {
            /*is css selector*/
            image = document.querySelector(imageLike)
            if( ! (image instanceof HTMLImageElement)) throw 'image is not valid selector of Image Element'
        }
    }
    if( !(image instanceof Image)) throw 'imageLike cannot convert to image'
    /* image is instance or dom element or Image instance*/
    if (image.complete) return image
    await waitFor('load', image)
    return image
}

export function isUrl (string) {
    try {
        const url = new URL(string, window.location.origin); // Supports relative paths
        return /\.(png|jpe?g|gif|svg|webp)$/.test(url.pathname);
    } catch {
        return false; // Not a valid URL
    }
}

export function isLandscape(){
    var query =  window.matchMedia('(orientation:landscape)')
    return query.matches
}

export function isPortrait(){
    var query =  window.matchMedia('(orientation:portrait)')
    return query.matches
}

export function setCanvas (canvas, byElement) {
    if (byElement) {
        if (byElement.width) {
            canvas.width = byElement.width
            canvas.height = byElement.height
        } else {
            var rect = byElement.getBoundingClientRect()
            canvas.width = rect.width
            canvas.height = rect.height
        }
    } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

}

/* set Object property */
export function protect (obj, key) {
    Object.defineProperty(obj, key, {
        writable: false,
        enumerable: true,
        configurable: true,
    })
}