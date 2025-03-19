export function getImageData (image, filters, width, height) {
    if (image instanceof Image) {
        width ??= image.width
        height ??= image.height
        var offScreenCanvas = new OffscreenCanvas(width, height)
        var ctx = offScreenCanvas.getContext('2d')
        if (filters) ctx.filter = filters
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height)
        return ctx.getImageData(0, 0, width, height);
    }
    throw 'image must be an image object'
}

function getPixel (pixels, i) {
    let r = pixels[i], g = pixels[i + 1], b = pixels[i + 2],
        a = pixels[i + 3];
    return [r, g, b, a]
}

export function processImageData (imageData, processors = []) {
    var pixels = imageData.data
    for (var process of processors) {
        for (let i = 0; i < pixels.length; i += 4) {
            let [r, g, b, a] = getPixel(pixels, i)
            let [nr, ng, nb, na] = process(r, g, b, a, i, pixels)
            pixels[i] = nr
            pixels[i + 1] = ng
            pixels[i + 2] = nb
            pixels[i + 3] = na
        }
    }
    return imageData
}

export function pixelsToScalar (imageData, mapFn) {
    var pixels = imageData.data
    var scalars = []
    for (let i = 0; i < pixels.length; i += 4) {
        let [r, g, b, a] = getPixel(pixels, i)
        scalars.push(mapFn(r, g, b, a, i, pixels))
    }
    return scalars


}

// pass and mix the channels input like 'rrr' , 'r', 'grb_'
export function channels (chs) {
    chs = chs.padEnd(4, '_')
    var i = ch => 'rgba'.indexOf(ch)
    return function (...channels) {
        channels[-1] = null
        return [
            channels[i(chs[0])] ?? 0,
            channels[i(chs[1])] ?? 0,
            channels[i(chs[2])] ?? 0,
            channels[i(chs[3])] ?? 255,
        ]
    }
}


export function brightnessProcessors () {
    return function (r, g, b, a) {
        let lum = (r * 0.2126 + g * 0.7152 + b * 0.0722)
        return [lum, lum, lum, a]
    }
}


export function euclideanBrightnessProcessors (r, g, b, a) {
    let lum = Math.hypot(r, g, b)
    return [lum, lum, lum, a]
}

function normalizeChannel (ch, i) {
    return (i = 'rgba'.indexOf(ch)) === -1 ? ch : i
}

export function thresholdProcessors (ch, th) {
    ch = normalizeChannel(ch)
    return function (...channels) {
        var lum = channels[ch]
        channels[ch] = (lum >= th) ? lum : 0
        return channels
    }
}

export function rampUpProcessors (ch, strong) {
    ch = normalizeChannel(ch)
    return function (...channels) {
        let lum = channels[ch]
        channels[ch] = Math.min(lum * strong, 255)
        return channels
    }
}

export function blackWhiteProcessors (ch, threshold) {
    ch = normalizeChannel(ch)
    return function (...channels) {
        let lum = channels[ch] > threshold ? 255 : 0
        channels[ch] = lum
        return channels
    }
}
