export function clamp (min, value, max) {
    return Math.max(Math.min(min, max), Math.min(max, value));
}

export function exceedsLimits (min, value, max) {
    if (value >= max) return true
    return value <= min;
}

export function random (min, max, integer = true) {
    if (min >= -1 && max <= 1) integer = false
    var value = Math.random() * (max - min) + min
    return integer ? Math.floor(value) : value
}