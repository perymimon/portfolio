export class Sprite {
    image = null
    spriteWidth = 100
    spriteHeight = 0
    frameCount = 10
    framesPerRow = 10
    columnZero = 0
    rowZero = 0

    // Animation properties
    fps = 60 // Frames per second

    constructor (index = 0) {
        this.index = index
        this.elapsedTime = 0
        this.width = this.spriteWidth
        this.height = this.spriteHeight
    }

    /** Update animation frame */
    updateFrame (deltaTime = 0) {
        // Update animation frame based on frameRate
        var frameTime = 1000 / this.fps
        this.elapsedTime += deltaTime
        var frames = Math.floor(this.elapsedTime / frameTime)
        this.elapsedTime -= frames * frameTime
        this.index = (this.index + frames) % this.frameCount

    }
    get spriteRatio(){
        return (this.spriteHeight / this.spriteWidth)
    }
    draw (ctx, centerX, centerY, width /*or size*/, height) {
        this.index %= this.frameCount
        let sx = (this.columnZero + this.index % this.framesPerRow) * this.spriteWidth,
            sy = Math.floor(this.rowZero + this.index / this.framesPerRow) * this.spriteHeight,
            sw = this.spriteWidth,
            sh = this.spriteHeight

        width = width || this.width
        height = height || this.height || /*ratio*/(width * this.spriteRatio)
        let tx = centerX - width / 2,
            ty = centerY - height / 2,
            tw = width,
            th = height

        ctx.drawImage(
            this.image, sx, sy, sw, sh,
            tx, ty, tw, th,
        )
    }


}

//
// class Sprite {
//     constructor ({
//                      imageSrc,
//                      x = 0,
//                      y = 0,
//                      width,
//                      height,
//                      sheetX = 0,
//                      sheetY = 0,
//                      sheetWidth,
//                      sheetHeight,
//                      frameCount = 1,
//                      frameRate = 10,
//                  }) {
//         this.image = new Image()
//         this.image.src = imageSrc
//
//         // Canvas position
//         this.x = x
//         this.y = y
//         this.width = width   // Rendered width
//         this.height = height // Rendered height
//
//         // Sprite sheet details
//         this.sheetX = sheetX     // Start X in the sprite sheet
//         this.sheetY = sheetY     // Start Y in the sprite sheet
//         this.sheetWidth = sheetWidth || width   // Width of a single frame in the sheet
//         this.sheetHeight = sheetHeight || height // Height of a single frame in the sheet
//
//         // Animation properties
//         this.frameCount = frameCount // Total frames for this sprite
//         this.currentFrame = 0
//         this.frameRate = frameRate // Frames per second
//         this.elapsedTime = 0
//     }
//
//     // Update sprite position or animation frame
//     update (deltaTime) {
//         // Update animation frame based on frameRate
//         this.elapsedTime += deltaTime
//         if (this.elapsedTime > 1000 / this.frameRate) {
//             this.currentFrame = (this.currentFrame + 1) % this.frameCount
//             this.elapsedTime = 0;
//         }
//     }
//
//     // Render the sprite on a canvas context
//     render (ctx) {
//         // Calculate the frame's position in the sheet
//         const frameX = this.sheetX + (this.currentFrame % (this.sheetWidth / this.width)) * this.sheetWidth;
//         const frameY = this.sheetY + Math.floor(this.currentFrame / (this.sheetWidth / this.width)) * this.sheetHeight;
//
//         ctx.drawImage(
//             this.image,
//             frameX, frameY,              // Source X, Y (sprite sheet position)
//             this.sheetWidth, this.sheetHeight, // Source width and height (frame size)
//             this.x, this.y,              // Destination X, Y (canvas position)
//             this.width, this.height,      // Destination width and height
//         );
//     }
//
//     // Move the sprite by a given delta
//     move (dx, dy) {
//         this.x += dx;
//         this.y += dy;
//     }
// }
