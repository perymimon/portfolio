export function distance (p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y)
}

/** from p2 to p1*/
export function getAngle (p2, p1) {
    return Math.atan2(p1.y - p2.y, p1.x - p2.x)
}

