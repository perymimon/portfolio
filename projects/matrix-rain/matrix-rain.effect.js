import {random} from '../_math/basic.js'
export class SymbolChar {
    constructor (c, r, fontSize, canvasHeight) {
        this.charactes = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-*/=%"'#&_(),.;:?\|{}<>[]^~`
        // this.charactes = `アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン`
        this.c = c

        this.fontSize = fontSize
        this.text = ''
        this.canvasHeight = canvasHeight
        this.init()
    }
    init(){
        this.r = - random(0, this.canvasHeight / 10)
    }

    draw (ctx) {
        const {floor, random} = Math
        const amount = this.charactes.length

        this.text = this.charactes[floor(random() * amount)]
        ctx.fillText(this.text, this.c * this.fontSize, this.r * this.fontSize)
        if ( this.r * this.fontSize > this.canvasHeight && random() > .94) {
            this.init()
        } else {
            this.r += 1
        }
    }
}

export class RainEffect {
    constructor (canvas, fontSize = 10) {
        this.fontSize = fontSize // todo: to do min max
        this.resize(canvas.width, canvas.height)
    }

    #init () {
        for (let i = 0; i < this.columns; i++) {
            this.symbols.push(new SymbolChar(i,0, this.fontSize, this.height))
            this.symbols.push(new SymbolChar(i,0, this.fontSize, this.height))
            this.symbols.push(new SymbolChar(i,0, this.fontSize, this.height))
        }
    }
    draw(ctx, fillStyle){
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        ctx.font = this.fontSize +'px MatrixCode'
        ctx.fillStyle = fillStyle
        this.symbols.forEach( symbol => symbol.draw(ctx))
    }
    resize(width, height) {
        this.width = width
        this.height = height
        this.columns = Math.floor(this.width / this.fontSize)
        this.symbols = []
        this.#init()
    }
}
