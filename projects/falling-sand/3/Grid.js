import {pixelsToScalar} from '../../_helpers/filters.colors.js'

const MAX_U_INT16 = 2 ** 17 - 1

export default class Grid {
    constructor (width, height, data = null) {
        this.width = width;
        this.height = height;
        this.cells = data ?? new Uint8Array(width * height);
    }

    index (x, y) {
        return y * this.width + x;
    }

    xy (index) {
        var x = index % this.width, y = Math.floor(index / this.width)
        return {x, y}
    }

    getCell (x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.cells[this.index(x, y)];
        }
        return 1; // Padding for out-of-bounds
    }

    setCell (x, y, value) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.cells[this.index(x, y)] = value;
        }
    }

    draw (ctx, frames, cellWidth, cellHeight, materials) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.cells[this.index(x, y)];
                if (cell === 0) continue; // Skip air
                const symbol = materials.symbols[cell];
                const [hue, range, speed, xf = 0, yf = 0] = materials[symbol].color;
                ctx.fillStyle = `hsl(${hue} 70% ${50 + (x * xf + y * yf + frames * speed / 100) % (range)}% )`;
                ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
            }
        }
    }

    draw2 (ctx, frames, cellWidth, cellHeight, sm) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.cells[this.index(x, y)];
                if (cell === 0) continue; // Skip air
                const [hue, range, speed, xf = 0, yf = 0] = sm.getColors(cell)
                if(hue === -1) ctx.fillStyle = 'transparent'
                else ctx.fillStyle = `hsl(${hue} 70% ${50 + (x * xf + y * yf + frames * speed / 100) % (range)}% )`;
                ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
            }
        }
    }

    getChunk (x, y) {
        // Returns a 9-character string representing the 3x3 neighborhood
        let pattern = []
        for (let dy = 1; dy >= -1; dy--) {
            for (let dx = -1; dx <= 1; dx++) { // left to right
                const cell = this.getCell(x + dx, y + dy)
                pattern.push(cell)
            }
        }
        return pattern.join('')
    }

    setChunk (x, y, pattern) {
        // Updates cells based of the pattern ( 9 byte )
        if (!pattern) return null // you can change that to warning
        let index = -1
        for (let dy = 1; dy >= -1; dy--) {
            for (let dx = -1; dx <= 1; dx++) {  // left to right
                ++index
                let symbol = pattern[index] // < updated
                if (symbol === undefined) continue // < update
                if (symbol === '0') continue  // < update
                this.setCell(x + dx, y + dy, symbol)
            }
        }
    }

    setImageData (sx, sy, imageData, mapFn) {
        var {width} = imageData
        for (let [i, d] of pixelsToScalar(imageData, mapFn).entries()) {
            if (d === null) continue
            let x = i % width,
                y = Math.floor(i / width)
            let cx = x + sx, cy = y + sy
            this.setCell(cx, cy, d)
        }
    }


}


