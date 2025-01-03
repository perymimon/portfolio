export function brightness (r, g, b) {
    return (r * 0.2126 +  g * 0.7152 + b * 0.0722)
}

export function euclideanBrightness (r, g, b) {
    return Math.hypot(r, g, b)
}

export function getImageData (image) {
    if (image instanceof Image) {
        var offScreenCanvas = new OffscreenCanvas(image.width, image.height)
        var ctx = offScreenCanvas.getContext('2d')
        ctx.drawImage(image, 0, 0, image.width, image.height)
        return ctx.getImageData(0, 0, image.width, image.height);
    }
    throw 'image must be an image object'
}

export function getBrightnessMap (image) {
    var imageData = getImageData(image)
    var pixels = imageData.data
    for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
        let br = brightness(r, g, b)
        pixels[i] = br
        pixels[i + 1] = br
        pixels[i + 2] = br
        pixels[i + 3] = 255
    }
    return imageData
}