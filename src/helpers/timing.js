export async function waitFor (eventName, element) {
    const {promise, resolve, reject} = Promise.withResolvers()
    try {
        element.addEventListener(eventName, resolve, {ones: true})
    } catch (e) {
        reject(e)
    }
    return promise
}

export function wait (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}