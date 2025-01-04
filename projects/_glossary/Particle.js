import {draw} from '../_helpers/draw.js'
import {Value} from './Value.js'

export class Particle {
    constructor(x, y, size) {
        this.x = new Value(x)
        this.y = new Value(y)
        this.size = size
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
}