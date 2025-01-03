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
function parseLightDark(value) {
    // Match the light-dark function and its parameters
    const match = value.match(/light-dark\(\s*((?:[^\(\)]|\([^)]*\))+)\s*,\s*((?:[^\(\)]|\([^)]*\))+)\s*\)$/);
    if (!match) return value; // Return as-is if no match

    const [,lightValue,darkValue] = match
    // Detect light or dark mode (customize this logic for your environment)
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Return the appropriate value
    return isDarkMode ? darkValue : lightValue;
}

export async function waitFor(eventName, element){
    return new Promise((resolve,reject)=>{
        try {
            element.addEventListener(eventName, resolve, {ones: true});
        }catch(e){
            reject(e);
        }


    })
}