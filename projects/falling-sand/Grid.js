import {exceedsLimits} from '../_math/math.js'

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

    getCell (x, y, mode = 'wrap', padValue = 0) {
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

    setCell (x, y, v, mode = 'wrap') {
        if (mode === 'wrap') {
            x = (x + this.width) % this.width
            y = (y + this.height) % this.height
        }
        // Skip out-of-bounds cells in 'pad' or 'clamp' mode
        if (exceedsLimits(0, x, this.width) || exceedsLimits(0, y, this.height))
            return
        this.cells[this.index(x, y)] = v
    }

    // Get 3x3 chunk as number (0-255)
    getChunk (x, y, mask = MAX_U_INT16, mode = 'wrap', padValue = 0) {
        let number = 0
        let bit = -1

        for (let dy = 1; dy >= -1; dy--) {
            for (let dx = 1; dx >= -1; dx--) {
                bit++
                const cell = this.getCell(x + dx, y + dy, mode, padValue);
                const m = (mask >> bit & 1)
                number |= (!!cell * m) << bit;
            }
        }
        return number;
    }

    // Set 3x3 chunk from number (0-255 )
    setChunk (x, y, pattern /* 9 bit */, mask = MAX_U_INT16, mode = 'wrap') {
        let bit = -1;
        for (let dy = 1; dy >= -1; dy--) {
            for (let dx = 1; dx >= -1; dx--) {
                bit++;
                if (!(mask >> bit & 1)) continue
                let nx = x + dx
                let ny = y + dy

                const pass = (pattern >> bit) & 1
                this.setCell(nx, ny, pass, mode)

            }
        }
    }

    setChunk2 (value, x, y, pattern, mode) {
        let bit = -1;
        for (let dy = 1; dy >= -1; dy--) {
            for (let dx = 1; dx >= -1; dx--) {
                bit++
                const pass = (pattern >> bit) & 1
                if (!pass) continue
                let nx = x + dx
                let ny = y + dy
                this.setCell(nx, ny, value, mode)
            }
        }
    }

    draw (ctx, cellSize, settings) {
        ctx.strokeStyle = 'white'
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let cell = this.cells[this.index(x, y)]
                // ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize)
                if (cell) {
                    ctx.fillStyle= `hsl(${cell} 50% 50% )`
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
                }
            }
        }

    }
}
