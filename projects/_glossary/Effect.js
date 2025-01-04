export class Effect {
    constructor(canvas) {
      this.canvas = canvas;
      this.particles = []
    }
    init(){
        throw 'init() must be implemented by derived class'
    }
    get width () { return this.canvas.width }
    get height () { return this.canvas.height }
    resize () {
        this.init()
    }
    update(){
        for( let p of this.particles ) {
            p.update()
        }
    }
    draw(ctx){
        for( let p of this.particles ) {
            p.draw(ctx)
        }
    }
}