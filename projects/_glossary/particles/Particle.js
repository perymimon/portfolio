import {draw} from '../../_helpers/draw.js'
import {Value} from '../Value.js'

export class Particle {
    constructor(x, y, size, effect) {
        this.x = new Value(x)
        this.y = new Value(y)
        this.size = size
        this.effect = effect
    }
    update() {
        this.x.update()
        this.y.update()
    }
    draw(ctx){
        draw.circle(ctx,this.x, this.y, this.size,{
            drawFill: true,
        });
    }
    setBoundary(padding){
        this.x.max = this.effect.width - padding
        this.x.min = padding
        this.y.max = this.effect.height - padding
        this.y.min = padding
    }
    debug(ctx){
        /*draw speed*/
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x + this.x.speed, this.y + this.y.speed)
        ctx.strokeStyle = `hsl(120 100% 50% / 80%)`
        ctx.lineWidth = 2
        ctx.stroke()

        /* draw velocity*/
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x + this.x.speed + this.x.velocity, this.y + this.y.speed + this.y.velocity)
        ctx.strokeStyle = `hsl(0 100% 50% / 80%)`
        ctx.lineWidth = 2
        ctx.stroke()

    }
}