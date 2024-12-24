export function clamp(min, value, max){
    return Math.max(Math.min(min, max), Math.min(max, value));
}
export function exceedsLimits(min, value, max){
    if(value >= max) return true
    return value <= min;
}