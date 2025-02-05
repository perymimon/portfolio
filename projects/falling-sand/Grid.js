export default class Grid {
    constructor (width, height) {
        this.width = width;
        this.height = height;
        this.cells = new Uint8Array(width * height);
    }

    // Convert (x,y) to index
    index (x, y) {
        return y * this.width + x
    }

    getCell (x, y) {
        return this.cells[this.index(x, y)]
    }

    setCell (x, y, v) {
        this.cells[this.index(x, y)] = v
    }

    getChunkByIndex (index) {
        const x = index % this.width
        const y = Math.floor(index / this.width)
        return this.getChunk(x, y)
    }

    // Get 3x3 chunk as number (0-255)
    getChunk (x, y) {
        let number = 0
        let bit = 0
        let bitWindow = 1

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                // Skip center cell (dx=0, dy=0)
                // if (dx === 0 && dy === 0) continue;

                const nx = (x + dx + this.width) % this.width; // Wrap around
                const ny = (y + dy + this.height) % this.height;
                const cell = this.cells[this.index(nx, ny)];

                number |= cell << bit;
                bit++;
            }
        }
        return number;
    }

    // Set 3x3 chunk from number (0-255)
    setChunk (x, y, number) {
        let bit = 0;

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                // if (dx === 0 && dy === 0) continue;

                const nx = (x + dx + this.width) % this.width;
                const ny = (y + dy + this.height) % this.height;
                const value = (number >> bit) & 1;

                this.cells[this.index(nx, ny)] = value;
                bit++;
            }
        }
    }

    draw (ctx, cellSize) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.cells[this.index(x, y)]) {
                    ctx.fillStyle = 'white';
                    ctx.fillRect(
                        x * cellSize,
                        y * cellSize,
                        cellSize,
                        cellSize,
                    );
                }
            }
        }

    }
}
