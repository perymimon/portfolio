import {imageFrom} from '../../_helpers/basic.js'
import {getImageData} from '../../_helpers/filters.colors.js'
import Pixel from '../primitive/Pixel.primitive.js'

export default class PixelImage {
    static async from (imageLike, preCssFilters, width, height) {
        var image = await imageFrom(imageLike)
        var imageData = getImageData(image, preCssFilters, width, height)
        return new PixelImage(imageData)
    }

    constructor (imageData) {
        this.imageData = imageData
    }

    #destructivePixels () {
        this.pixels = []
        var {width, height} = this.imageData
        var pixels = width * height
        for (let i = 0; i < pixels; i++) {
            this.pixels[i] = new Pixel(i, this.imageData)
        }
    }

    cleanMemory () {
        delete this.pixels
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
        if (!this.pixels) this.#destructivePixels()
        for (let pixel of this.pixels) {
            yield pixel
        }
    }

    draw (ctx, tx, ty) {

        if (this.pixels) {
            // this.pixels?.forEach(pixel => pixel.save(this.imageData))
            this.pixels?.forEach(pixel => pixel.draw(ctx))
        }else{
            const [sx, sy, sw, sh] = [0, 0, this.imageData.width, this.imageData.height]
            ctx.putImageData(
                this.imageData, tx, ty,
                sx, sy, sw, sh,
            )
        }



    }

}

