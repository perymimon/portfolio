import {drawAlgebra} from '../../_helpers/draw.js'
import {angle2P, clamp, distance, exceedsLimits} from '../../_math/math.js'

class Particle {
    constructor (effect, index) {
        this.effect = effect
        this.index = index
        this.radius = Math.floor(3 + Math.random() * 10);
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2)
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2)
        this.pushX = 0
        this.pushY = 0
        this.friction = 0.8
    }

    draw (ctx) {
        drawAlgebra.circle(ctx, this, this.radius, {drawFill: true})
    }

    update () {
        let {mouse} = this.effect
        if (mouse.pressed) {
            let dis = distance(mouse, this)
            if (dis < mouse.radius) {
                let force = 4 * mouse.radius / dis
                let angle = angle2P(this, mouse)
                this.pushX = Math.cos(angle) * force
                this.pushY = Math.sin(angle) * force
            }
        }
        this.x += this.vx + (this.pushX *= this.friction)
        this.y += this.vy + (this.pushY *= this.friction)
        let x = {min: this.radius, max: this.effect.width - this.radius}
        let y = {min: this.radius, max: this.effect.height - this.radius}
        if (exceedsLimits(x.min, this.x, x.max)) this.vx *= -1;
        if (exceedsLimits(y.min, this.y, y.max)) this.vy *= -1;

        this.x = clamp(x.min, this.x, x.max)
        this.y = clamp(y.min, this.y, y.max)
    }

    reposition () {
        this.x = clamp(this.radius, this.x, this.effect.width)
        this.y = clamp(this.radius, this.y, this.effect.height)

        this.vx = Math.random() * 1 - .5
        this.vy = Math.random() * 1 - .5
    }
}

export default class Effect {
    constructor (canvas, amount = 300) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.particles = [];
        this.numberOfParticles = amount;
        this.createParticles()

        this.resize(this.width, this.height);

        this.mouse = {x: 0, y: 0, pressed: false, radius: 120}

        window.addEventListener("mousemove", e => {
            this.mouse.x = e.x
            this.mouse.y = e.y
        })
        window.addEventListener("mousedown", e => this.mouse.pressed = true);
        window.addEventListener("mouseup", e => this.mouse.pressed = false);
    }

    createParticles () {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this, i))
        }
    }

    setStyle (ctx, gradient) {
        if (gradient) ctx.fillStyle = gradient
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 1;
    }

    update () {
        this.particles.forEach((particle) => particle.update())
    }

    draw (ctx) {
        // this.setStyle(ctx)
        this.connectParticles(ctx)
        this.particles.forEach((particle) => {
            particle.draw(ctx);
        })
    }

    connectParticles (ctx) {
        var maxDistance = 200
        for(let pa of this.particles) {
            for(let pb of this.particles) {
                let dis = distance(pa, pb)
                if (dis < maxDistance) {
                    ctx.save()
                    ctx.globalAlpha = 1 - dis / maxDistance;
                    drawAlgebra.line(ctx, pa, pb, {drawStroke: true})
                    ctx.restore()
                }
            }
        }
    }

    resize (width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.particles.forEach((particle) => particle.reposition())
        this.onResize?.()
    }

}
