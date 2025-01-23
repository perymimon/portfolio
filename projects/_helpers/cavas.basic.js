import {getProperty} from './basic.js'

export function getRadialGradient(ctx, cx, cy, maxRadius, colorStops) {
    var gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius)
    console.log('reererer')
    for(let present in colorStops) {
        present = Number(present)
        gradient.addColorStop(present, getProperty(ctx, colorStops[present]))
    }
    return gradient
}