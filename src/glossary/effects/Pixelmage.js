import {imageFrom} from '../../helpers/basic.js'
import {
    brightnessProcessors, getImageData,
} from '../../helpers/filters.colors.js'

const brightness = brightnessProcessors()
export default class PixelImage {
    static async from (imageLike, preCssFilters, width, height) {
        var image = await imageFrom(imageLike)
        var imageData = getImageData(image, preCssFilters, width, height)
        return new PixelImage(imageData)
    }

    constructor (imageData) {
        this.imageData = imageData
        var {width, height} = this.imageData
        this.pixelAmount = width * height

        this.toDrawImageData = imageData
        this.#rasterize()
        this.render2()
    }

    #rasterize () {
        var {width, height} = this.imageData
        this.xyBuffer = new Float32Array(width * height * 2) // XY buffer
        for (let i = 0; i < width * height; i++) {
            this.xyBuffer[i * 2] = i % width //x
            this.xyBuffer[i * 2 + 1] =  Math.floor(i / width)//y
        }
    }

    processor (processors = []) {
        for (var process of processors) {
            const {width, height} = this.imageData
            const newImageData = new ImageData(width, height)

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const i = (y * width + x) * 4
                    const [r, g, b, a] = [
                        this.imageData.data[i],
                        this.imageData.data[i + 1],
                        this.imageData.data[i + 2],
                        this.imageData.data[i + 3],
                    ]
                    const [nr, ng, nb, na, nx, ny] = process.call(this, r, g, b, a, x, y, i, pixels)
                    // Ensure new coordinates are within bounds
                    const ni = (nx + ny * width) * 4
                    if (ni > newImageData.length) continue
                    newImageData.data[ni] = nr
                    newImageData.data[ni + 1] = ng
                    newImageData.data[ni + 2] = nb
                    newImageData.data[ni + 3] = na
                }
            }
            this.imageData = newImageData
        }
    }

    * [Symbol.iterator] () {
        // console.time('pixel Iterable')
        const { xyBuffer } = this;
        const len = this.pixelAmount * 2;

        let pixel = { x: 0, y: 0, i: 0, set: (coords) => {
                xyBuffer[pixel.i * 2] = coords.x;
                xyBuffer[pixel.i * 2 + 1] = coords.y;
            }};

        for (let i = 0; i < len; i += 2) {
            pixel.x = xyBuffer[i];
            pixel.y = xyBuffer[i + 1];
            pixel.i = i / 2;
            yield pixel; // Reuse the same object
        }

        // console.timeEnd('pixel Iterable');
    }

    render () {
        // console.time('render-1')
        var {width, height, data} = this.imageData
        var offScreenCanvas = new OffscreenCanvas(width, height)
        var ctx = offScreenCanvas.getContext('2d')
        for (let i = 0; i < width * height; i++) {
            var [x, y] = this.xyBuffer.subarray(i * 2, i * 2 + 2)
            var [r, g, b, a] = data.subarray(i * 4, i * 4 + 4)
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
            ctx.fillRect(x, y, 1, 1)
        }
        this.offScreenCanvas = offScreenCanvas
        // console.timeEnd('render-1')
    }
    render4(){
        // console.time('render-4')
        var {width, height, data} = this.imageData
        const blendedColor = new Uint8ClampedArray(width * height * 4); // Stores blended colors
        for (let i = 0; i < width * height; i++) {
            var [x, y] = this.xyBuffer.subarray(i * 2, i * 2 + 2).map(v=> Math.floor(v))
            if (x < 0 || y < 0 || x >= width || y >= height) continue;
            var color = data.subarray(i * 4, i * 4 + 4)
            let index = (y * width + x) * 4;

            blendedColor.set(color, index)
        }
        this.toDrawImageData = new ImageData(blendedColor, width, height)
        // console.timeEnd('render-4')
    }
    render2 () {
        // console.time('render-2')
        var {width, height, data} = this.imageData
        const blendedColor = new Uint8ClampedArray(width * height * 4); // Stores blended colors

        for (let i = 0; i < width * height; i++) {
            var [x, y] = this.xyBuffer.subarray(i * 2, i * 2 + 2)

            if (x < -1 || y < -1 || x > width || y > height) continue;

            var color = data.subarray(i * 4, i * 4 + 4)
            /* 4 Pixel Around the Position */
            var [x0, y0] = [Math.floor(x), Math.floor(y)] //left top pixel
            var [x1, y1] = [x0 + 1, y0 + 1] // right bottom pixel
            // Compute bilinear weights
            var [wx, wy] = [x - x0, y - y0]  // right, bottom wights
            var [w00, w10, w01, w11] = [
                (1 - wx) * (1 - wy), // Top-left
                (wx) * (1 - wy),   // Top-right
                (1 - wx) * (wy),   // Bottom-Left
                (wx) * (wy),     // Bottom-Right
            ]
            // Distribute color to 4 nearest pixels
            addWeight(x0, y0, w00, color); // Top-left
            addWeight(x1, y0, w10, color); // Top-right
            addWeight(x0, y1, w01, color); // Bottom-left
            addWeight(x1, y1, w11, color); // Bottom-right
        }

        function addWeight (x, y, w, colors) {
            if (x < 0 || y < 0 || x >= width || y >= height) return;
            let index = (y * width + x) * 4;

            blendedColor.set([
                blendedColor[index] + colors[0]  * w ,
                blendedColor[index + 1] + colors[1] * w ,
                blendedColor[index + 2] + colors[2] * w,
                blendedColor[index + 3] + colors[3] * w,
            ], index)
        }

        this.toDrawImageData = new ImageData(blendedColor, width, height)
        // console.timeEnd('render-2')
    }

    render3 () {
        // console.time('render-3')

        var {width, height, data} = this.imageData;

        // Create buffers for color accumulation
        const buffer = new Float32Array(width * height * 4); // Stores blended colors
        const weightBuffer = new Float32Array(width * height); // Stores blending weights

        for (let i = 0; i < this.xyBuffer.length / 2; i++) {
            var x = this.xyBuffer[i * 2], y = this.xyBuffer[i * 2 + 1]; // Floating position
            var r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2],
                a = data[i * 4 + 3]; // Color

            // Find nearest pixels
            const x0 = Math.floor(x), y0 = Math.floor(y); // Base pixel
            const x1 = x0 + 1, y1 = y0 + 1; // Next pixel

            // Compute bilinear weights
            const wx = x - x0, wy = y - y0;
            const w00 = (1 - wx) * (1 - wy); // Top-left
            const w10 = wx * (1 - wy); // Top-right
            const w01 = (1 - wx) * wy; // Bottom-left
            const w11 = wx * wy; // Bottom-right

            function addWeight (x, y, wr) {
                if (x < 0 || y < 0 || x >= width || y >= height) return;
                let index = (y * width + x) * 4;
                buffer[index] += r * wr;
                buffer[index + 1] += g * wr;
                buffer[index + 2] += b * wr;
                buffer[index + 3] += a * wr;
                weightBuffer[y * width + x] += wr;
            }

            // Distribute color to 4 nearest pixels
            addWeight(x0, y0, w00); // Top-left
            addWeight(x1, y0, w10); // Top-right
            addWeight(x0, y1, w01); // Bottom-left
            addWeight(x1, y1, w11); // Bottom-right
        }

        // Normalize accumulated colors and copy to new ImageData
        const newImageData = new ImageData(width, height);
        for (let i = 0; i < buffer.length; i += 4) {
            let weight = weightBuffer[i / 4] || 1;
            newImageData.data[i] = Math.min(255, buffer[i] / weight);
            newImageData.data[i + 1] = Math.min(255, buffer[i + 1] / weight);
            newImageData.data[i + 2] = Math.min(255, buffer[i + 2] / weight);
            newImageData.data[i + 3] = Math.min(255, (buffer[i + 3] / weight) * 255);
        }

        // Replace the original imageData
        this.toDrawImageData = newImageData;
        // console.timeEnd('render-3')

    }

    drawPixel (ctx, pixel) {
        const [r, g, b, a] = this.imageData.data.slice(pixel.i * 4 + 4)
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.fillRect(pixel.x, pixel.y, 1, 1)
    }

    draw (ctx, tx, ty) {
        const [sx, sy, sw, sh] = [0, 0, this.imageData.width, this.imageData.height]
        if (this.offScreenCanvas) {
            var {width, height} = this.offScreenCanvas
            ctx.drawImage(this.offScreenCanvas, 0, 0, width, height, sx, sy, sw, sh)
        } else {
            ctx.putImageData(this.toDrawImageData, 0, 0)
        }

        // ctx.putImageData(this.toDrawImageData, 0, 0)
        // var {width, height} = this.offScreenCanvas
        // ctx.drawImage(this.offScreenCanvas,0,0,width, height, sx, sy, sw, sh)
    }

}

