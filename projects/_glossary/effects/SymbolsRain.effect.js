import {Effect} from '../Effect.js'
import {Particle} from '../primitive/Particle.js'
import {random} from '../../_math/math.js'

/* 30 lines */
var charactes = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-*/=%"'#&_(),.;:?\|{}<>[]^~`

// var charactes = `アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン`
export class SymbolChar extends Particle {
    constructor (c, r, fontSize, effect) {
        super(c * fontSize, r * fontSize, fontSize, effect)
        this.setBoundary(0)
        this.y.speed = fontSize
        this.y.start = () => -random(0, Math.floor(this.effect.height / fontSize)) * fontSize
        this.y.onAboveMax = (y) => {
            if (random(0, 1) > .94) y.reset()
        }
        this.text = ''
        this.y.reset()
    }

    update () {
        this.text = charactes[random(0, charactes.length)]
        super.update()
    }

    draw (ctx) {
        ctx.fillText(this.text, this.x.value, this.y.value)
    }
}

/* 27 lines*/
export class SymbolsRainEffect extends Effect {
    constructor (width, height, fontSize = 10) {
        super(width,height, {fontSize})
        this.init()
    }

    init () {
        this.particles = []
        var columns = Math.floor(this.width / this.settings.fontSize)
        var {fontSize} = this.settings
        for (let i = 0; i < columns; i++) {
            this.particles.push(new SymbolChar(i, 0, fontSize, this))
        }
    }

    draw (ctx, fillStyle) {
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        ctx.font = this.settings.fontSize + 'px MatrixCode'
        ctx.fillStyle = fillStyle
        super.draw(ctx)
    }

}
