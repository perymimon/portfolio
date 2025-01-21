export function clamp (min, value, max) {
    return Math.max(Math.min(min, max), Math.min(max, value));
}

export function exceedsLimits (min = -Infinity, value, max = Infinity) {
    return value < min || value > max;
}

export function isBetween (min, value, max) {
    return value >= min && value <= max
}

export function random (min, max, integer = true) {
    if (min >= -1 && max <= 1) integer = false
    var value = Math.random() * (max - min) + min
    return integer ? Math.floor(value) : value
}

export function lerp (A, B, t) {
    return A + (B - A) * t
}

export function linearLerp (A, B, s) {
    var v = A + s
    return v > B ? B : v
}