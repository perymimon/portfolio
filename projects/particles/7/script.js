import {Sprite} from '../../_glossary/effects/Sprite.js'
import {drawAlgebra} from '../../_helpers/draw.js'
import {
    angle2P, clamp, distance, exceedsLimits, isBetween, lerp, random,
} from '../../_math/math.js'

// setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, 'darkblue');
gradient.addColorStop(0.5, 'white');
gradient.addColorStop(1, 'lightblue');

class StarSprite extends Sprite {
    image = document.getElementById("star")
    spriteWidth = 50
    spriteHeight = 50
    frameCount = 9;
    framesPerRow = 3;
}

class WhaleSprite extends Sprite {
    image = document.getElementById("whale")
    spriteWidth = 420
    spriteHeight = 285
    frameCount = 39
    framesPerRow = 39
    width = 200
    fps = 80

    // height = this.width * (this.spriteHeight / this.spriteWidth)

    constructor (effect, animationIndex = 0) {
        super(0)
        this.effect = effect
        this.x = this.effect.width * .4
        this.y = this.effect.height / 2
        this.angle = 0
        this.va = 0.04
        /* select animation*/
        this.rowZero = animationIndex
        /*push stars*/
        this.radius = Math.hypot(this.width * this.spriteRatio, this.width) * .5
        this.curveAmplitude = this.radius
    }

    draw (ctx, width, height) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(Math.cos(this.angle) / 2)
        super.draw(ctx, 0, 0, width, height)
        ctx.restore()
    }

    update (deltaTime) {
        this.angle += this.va
        this.angle %= Math.PI * 2
        var effectRadius = this.effect.height / 2
        this.y = effectRadius + Math.sin(this.angle) * this.curveAmplitude

        super.updateFrame(deltaTime)
    }
}

class Particle {
    constructor (effect) {
        this.effect = effect
        this.radius = random(5, 20)

        var padding = this.effect.maxDistance + this.radius
        this.xValue = {min: 0 - padding, max: padding + this.effect.width}
        this.x = random(this.xValue.min, this.xValue.max)

        this.pushX = 0
        this.pushY = 0
        this.friction = 0.98
        this.star = new StarSprite(random(0, 9))

        this.reset()
    }

    reset () {
        this.vx = random(-1, -.8) * 4

        this.vy = 0
        this.y = random(0, this.effect.height)
        this.initY = this.y
        this.initX = this.x
    }

    draw (ctx) {
        // drawAlgebra.circle(ctx, this, this.radius, {drawFill: true})
        this.star.draw(ctx, this.x, this.y, this.radius * 2)
    }

    resize () {
        this.x = clamp(this.xValue.min, this.x, this.xValue.max)
        this.y = clamp(this.radius, this.y, this.effect.height)
    }

    update () {
        let {whale} = this.effect

        let dis = distance(whale, this)
        let angle = angle2P(this,whale)
        if (dis < whale.radius && isBetween(-Math.PI /2 ,angle, Math.PI /2)) {
            let force = 3 * (whale.radius / dis)

            this.pushX = Math.cos(angle) * force
            this.pushY = Math.sin(angle) * force
        } else {
            this.y = lerp(this.y, this.initY, .05)
            this.x = lerp(this.x, this.initX, .01)
        }
        this.x += this.vx + (this.pushX *= this.friction)
        this.y += this.vy + (this.pushY *= this.friction)
        this.initX +=this.vx

        if (this)
            if (exceedsLimits(this.xValue.min, this.x, this.xValue.max)) {
                this.x = this.effect.width + this.radius + this.effect.maxDistance
                this.reset()
            }

    }


}

class Effect {
    constructor (canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.particles = [];
        this.densityPerPixel = 0.0005
        this.maxDistance = 150
        this.numberOfParticles = this.width * this.height * this.densityPerPixel;
        this.createParticles()
        this.resize(this.width, this.height);
        this.whale = new WhaleSprite(this, random(0, 3))

        this.mouse = {
            x: 0,
            y: 0,
            pressed: false,
            radius: 200,
        }

        window.addEventListener("resize", e => {
            let {innerWidth, innerHeight} = e.currentTarget;
            this.resize(innerWidth, innerHeight, this.ctx);
        });
        window.addEventListener("mousemove", e => {
            this.mouse.x = e.x
            this.mouse.y = e.y
        })
        window.addEventListener("mousedown", e => this.mouse.pressed = true);
        window.addEventListener("mouseup", e => this.mouse.pressed = false);
    }

    createParticles () {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this))
        }
    }

    handleParticles (ctx, deltaTime) {
        this.connectParticles(ctx)
        this.whale.update(deltaTime)
        this.whale.draw(ctx)
        this.particles.forEach((particle) => {
            particle.update()
            particle.draw(ctx);
        })
    }

    connectParticles (ctx) {

        for (let a = 0; a < this.numberOfParticles; a++) {
            for (let b = a; b < this.particles.length; b++) {
                let pa = this.particles[a]
                let pb = this.particles[b]
                let dis = distance(pa, pb)
                if (dis < this.maxDistance) {
                    ctx.save()
                    ctx.globalAlpha = 1 - dis / this.maxDistance;
                    drawAlgebra.line(ctx, pa, pb, {drawStroke: true})
                    ctx.restore()
                }
            }
        }
    }

    resize (width, height) {
        let {ctx} = this
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;

        ctx.fillStyle = gradient;
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 1;
        this.particles.forEach((particle) => particle.resize())
    }
}
var requestId = null
window.addEventListener('load', () => {
    const effect = new Effect(canvas);

    var lastTimeStamp = null

    // Array(5000).forEach( _=> effect.primitive.forEach(p => p.update()))

    function animation (timeStamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var deltaTime = lastTimeStamp ? timeStamp - lastTimeStamp : 0
        lastTimeStamp = timeStamp;
        effect.handleParticles(ctx, deltaTime);

        requestId = requestAnimationFrame(animation)
    }

    requestId = requestAnimationFrame(animation)
})
window.addEventListener("pageswap", (e) =>{
    cancelAnimationFrame(requestId)
})
