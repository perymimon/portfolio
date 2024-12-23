// setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = 'red'
ctx.lineWidth = 5;

class Particle {
    constructor (effect) {
        this.effect = effect;
        this.radius = 5 + Math.random() * 50;
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
        this.vx = Math.random() * 4 - 2
        this.vy = Math.random() * 4 - 2

    }

    draw (ctx) {

        ctx.fillStyle = `hsl(${this.x * .5},100%, 50%)`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
    }

    update () {
        this.x += this.vx
        this.y += this.vy
        if (this.x + this.radius > this.effect.width || this.x < this.radius) this.vx *= -1;
        if (this.y + this.radius > this.effect.height || this.y < this.radius) this.vy *= -1;
    }
}

class Effect {
    constructor (canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.particles = [];
        this.numberOfParticles = 150;
        this.createParticles()
    }

    createParticles () {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this))
        }
    }

    handleParticles () {

        this.particles.forEach((particle) => {
            particle.update()
            particle.draw(ctx);
        })
    }
}

const effect = new Effect(canvas);
effect.handleParticles(ctx)

function animation () {
    effect.handleParticles(ctx)
    requestAnimationFrame(animation)
}

requestAnimationFrame(animation)