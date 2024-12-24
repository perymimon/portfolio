export function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y)
}
export function getAngle(p1, p2) {
    return Math.atan2(p1.x - p2.x, p1.y - p2.y)
}