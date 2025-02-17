import {exceedsLimits} from '../../_math/math.js'

const MAX_U_INT16 = 2 ** 17 - 1

export default class Grid {
    constructor (width, height) {
        this.width = width;
        this.height = height;
        this.cells = new Uint8Array(width * height);
    }

    clear (clearValue = 0) {
        this.cells.fill(clearValue)
    }

    // Convert (x,y) to index
    index (x, y) {
        return y * this.width + x
    }

    xy (index) {
        return {
            x: index % this.width,
            y: Math.floor(index / this.width),
        }
    }

    getCell (x, y, mode = 'pad', padValue = 0) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.cells[this.index(x, y)]; // Inside grid
        }

        switch (mode) {
            case 'wrap':
                // Wrap around edges (toroidal grid)
                x = (x + this.width) % this.width;
                y = (y + this.height) % this.height;
                return this.cells[this.index(x, y)];

            case 'pad':
                // Use padding value for out-of-bounds
                return padValue;

            case 'clamp':
                // Clamp to nearest edge
                x = Math.max(0, Math.min(this.width - 1, x));
                y = Math.max(0, Math.min(this.height - 1, y));
                return this.cells[this.index(x, y)];

            default:
                throw new Error(`Unknown mode: ${mode}`);
        }
    }

    setCell (x, y, v, mode = 'pad') {
        if (mode === 'wrap') {
            x = (x + this.width) % this.width
            y = (y + this.height) % this.height
        }
        // Skip out-of-bounds cells in 'pad' or 'clamp' mode
        if (exceedsLimits(0, x, this.width) || exceedsLimits(0, y, this.height))
            return

        this.cells[this.index(x, y)] = v
    }


    /**
     * Get 3x3 chunk as number (0-255) cell order is bottom to top left to right
     * @param mask is string
     * @param mode
     * @param padValue
     * @returns {string}
     */
    getChunk (x, y, mask = '111_111_111', mode = 'pad', padValue = 1) {
        let pattern = []
        mask = mask.padEnd(9, '0')
        let m = -1
        for (let dy = 1; dy >= -1; dy--) {
            for (let dx = -1; dx <= 1; dx++) {
                m++
                if (mask[m] === '0') continue
                const cell = this.getCell(x + dx, y + dy, mode, padValue);
                pattern.push(cell);
            }
        }
        return pattern.join('')
    }

    // Set 3x3 chunk from number (0-255 )
    setChunk (x, y, pattern /* 9 bit */, mask = MAX_U_INT16, mode = 'pad') {
        let index = -1;
        for (let dy = 1; dy >= -1; dy--) {
            for (let dx = -1; dx >= 1; dx++) {
                index++;
                if (!(mask >> index & 1)) continue
                const symbol = pattern[index]
                if (symbol === '0') continue

                let nx = x + dx
                let ny = y + dy
                this.setCell(nx, ny, symbol, mode)

            }
        }
    }

    setChunk2 (value, x, y, pattern, mode) {
        let index = -1;
        pattern = pattern.padEnd(9, '0')
        for (let dy = 1; dy >= -1; dy--) {
            for (let dx = -1; dx <= 1; dx++) {
                let symbol = pattern[++index]
                if (symbol === '0') continue
                if (symbol === '1') symbol = value
                this.setCell( x + dx, y + dy, symbol, mode)
            }
        }
    }

    draw (ctx, cellW, cellH, matrialsColorMap = {}) {
        ctx.strokeStyle = 'white'
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let index = this.index(x, y)
                let cell = this.cells[index]
                // ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize)

                if (cell) {
                    let symbol = matrialsColorMap.symbols[cell]
                    var [start, end] = matrialsColorMap[symbol].color
                    var range = end - start
                    var hue = start + Math.sign(range) * (index % range)
                    ctx.fillStyle = `hsl(${hue} 50% 50% )`
                    ctx.fillRect(x * cellW, y * cellH, cellW, cellH)
                }
            }
        }

    }
}

function cycle (min, max, value) {

}

