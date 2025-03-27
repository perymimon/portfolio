import {clamp} from './math.js'

//https://youtu.be/NhVUCsXp-Uo?si=XjBJWeLhcu4GGtbk&t=105
export default function closesPointOnSegment (p, a, b) {
    var ab = a.vectorTo(b)
    var t = ab.dot(ab)
    if (t === 0)
        return a.clone
    t = clamp(0, (p.dot(ab) - a.dot(ab)) / t, 1)
    return a.clone.add(ab, t)
}