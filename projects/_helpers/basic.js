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

export async function getImage (url) {
    var image = new Image()
    image.src = url
    await waitFor('load', image)
    return image
}

export async function getImageLoaded (image) {
    if (typeof image == 'string') {
        image = document.querySelector(image)
    }
    if (image.complete) return image
    await waitFor('load', image)
    return image
}

export function setCanvas(canvas, element){
    if(element){
        if(element.width ) {
            canvas.width = element.width
            canvas.height = element.height
        }else{
            var rect = element.getBoundingClientRect()
            canvas.width = rect.width
            canvas.height = rect.height
        }
    }else{
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

}