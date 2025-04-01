import {getProperty} from './basic.js'

export function getRadialGradient(ctx, cx, cy, maxRadius, colorStops) {
    var gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius)
    for(let present in colorStops) {
        present = Number(present)
        gradient.addColorStop(present, getProperty(ctx, colorStops[present]))
    }
    return gradient
}

export function getLinearGradient(ctx, xs, xe, ys, ye, colorStops) {
    const gradient = ctx.createLinearGradient(xs, ys, xe, ye)
    for(let present in colorStops) {
        present = Number(present)
        gradient.addColorStop(present, getProperty(ctx, colorStops[present]))
    }
    return gradient
}
