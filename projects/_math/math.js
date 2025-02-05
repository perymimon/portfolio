export const eps = 0.001
export const maxeps = 0.999

/* 1D Math */
export function clamp (min, value, max) {
    return Math.max(Math.min(min, max), Math.min(max, value));
}

export function exceedsLimits (min = -Infinity, value, max = Infinity) {
    return value < min || value >= max;
}

export function isBetween (min, value, max) {
    return value >= min && value <= max
}

export function random (min, max, integer = true) {
    if (min >= -1 && max <= 1) integer = false
    var value = Math.random() * (max - min) + min
    return integer ? Math.floor(value) : value
}
export function randomItem(array){
    return array[random(0,array.length)]
}

export function lerp (A, B, t) {
    return A + (B - A) * t
}

export function linearLerp (A, B, s) {
    var v = A + s
    return v > B ? B : v
}

/* trigonometric from 0 to 1*/
export function cos (angle) {
    var a = (angle / 1) * (Math.PI * 2)
    return Math.cos(a)
}

export function sin (angle) {
    var a = (angle / 1) * (Math.PI * 2)
    return Math.sin(a)
}

/*  2D Math   */
export function distance (p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y)
}

/** from p2 to p1*/
export function angle2P (p1, p2) {
    return Math.atan2(p1.y - p2.y, p1.x - p2.x)
}

export function angle (p) {
    return Math.atan2(p.y, p.x)
}

export function add (p1, p2) {
    return {x: p1.x + p2.x, y: p1.y + p2.y}
}

export function scale (p, scalar = 1) {
    return {x: p.x * scalar, y: p.y * scalar}
}

// export function normalize(p) {
//     return scale(p, 1 / magnitude(p))
// }

export function magnitude (p) {
    return Math.hypot(p.x, p.y)
}

// export function midPoint(p1, p2) {
//     return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2)
// }

export function dot (p1, p2) {
    return p1.x * p2.x + p1.y * p2.y
}

export function cross (p1, p2) {
    return p1.x * p2.y - p1.y * p2.x
}

export function vectorFrom (p1, p2) {
    return {x: p2.x - p1.x, y: p2.y - p1.y};
}

export function subtract (p1, p2) {
    return {x: p1.x - p2.x, y: p1.y - p2.y}
}


export function getNearestPoint (point, points, threshold = Number.MAX_SAFE_INTEGER) {
    if (points.length === 0) return null;

    let minDistance = Infinity;
    let nearest = points.reduce((nearest, p) => {
        let current = distance(point, p)
        if (current < threshold && minDistance > current) {
            minDistance = current
            return p
        }
        return nearest
    })
    return {nearest, distance: minDistance}
}

/* ----- new staff ----------*/


export function getNearestSegment (point, segments, threshold = Number.MAX_SAFE_INTEGER) {
    if (segments.length === 0) return null;

    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null
    for (let seg of segments) {
        let dist = seg.distanceToPoint(point)
        if (dist < minDist && dist < threshold) {
            minDist = dist
            nearest = seg
        }
    }
    return nearest
}

export function getNearestPolygon (point, polygons, threshold = Number.MAX_SAFE_INTEGER) {
    if (polygons.length === 0) return null;

    let nearestPolygon = null;
    let minDist = threshold;

    for (const poly of polygons) {
        // Quick check: distance from polygon's centroid to the point minus radius
        // Skip this polygon if rough distance is greater than the current minimum distance
        if (distance(point, poly.centeroid) > (poly.radius + threshold)) continue
        // If within range, calculate the exact distance
        let pointInside = poly.containsPoint(point)
        if (pointInside) return poly

        const dist = poly.distanceToPoint(point);
        if (dist < minDist) {
            minDist = dist;
            nearestPolygon = poly;
        }
    }

    return nearestPolygon
}

export function vector3d (horAngle, verAngle, length) {
    return new Point(
        Math.cos(horAngle) * Math.cos(verAngle) * length, // X component
        Math.sin(horAngle) * Math.cos(verAngle) * length, // Y component
        Math.sin(verAngle) * length,                            // Z component
    );
}


export function toPolarForm (p) {
    return {
        angle: angle(p),
        magnitude: magnitude(p),
    }
}

/**
 *
 * @param magnitude - must be positive number
 * @param angle
 * @returns {{x: number, y: number}}
 */

export function polarToXY (magnitude, angle) {
    //zero is up by the game
    angle += Math.PI / 2
    return {
        x: magnitude * Math.cos(angle),
        // - is because screen is opposite on Y axis and want
        // 90deg point up
        y: -magnitude * Math.sin(angle),
    }
}

export function translate (point, angle, offset) {
    return new Point(
        point.x + Math.cos(angle) * offset,
        point.y + Math.sin(angle) * offset,
        point.z,
    )
}

export function translate3d (point, offset, angle, angle2 = 0) {
    return new Point(
        point.x + Math.cos(angle) * offset,
        point.y + Math.sin(angle) * offset,
        point.z + Math.sin(angle2) * offset,
    )
}


export function radToDeg (rad) {
    return ((180 / Math.PI) * rad).toFixed(3)
}

console.assert(radToDeg(Math.PI / 4) == 45)
console.assert(radToDeg(Math.PI / 3) == 60)
console.assert(radToDeg(Math.PI) == 180)

export function degToRad (deg) {
    return ((Math.PI / 180) * deg).toFixed(3)
}

export function inward (a, b, p = 0.3) {
    var A = lerp2D(a, b, p)
    var B = lerp2D(b, a, p)
    a.x = A.x
    a.y = A.y
    b.x = B.x
    b.y = B.y
}


export function polysIntersect (poly1, poly2) {
    for (let i = 0; i < poly1.length; i++)
        for (let j = 0; j < poly2.length; j++) {
            let A = poly1[i]
            let B = poly1[(i + 1) % poly1.length]
            let C = poly2[j]
            let D = poly2[(j + 1) % poly2.length]

            const touch = getIntersection(A, B, C, D)
            if (touch) return true
        }
    return false
}

export function isPointIntoPolygon (point, poly) {
    const outerPoint = new Point(-10000, -10000)
    const crossSegment = new Segment(outerPoint, point)
    let intersectionCount = 0;
    for (const seg of poly.segments) {
        const int = crossSegment.intersection(seg)
        if (int) intersectionCount++
    }
    return intersectionCount % 2 == 1
}

export function getFake3dPoint (point, viewPoint, height) {
    const dir = normalize(subtract(point, viewPoint));
    const dist = distance(point, viewPoint);
    const scalar = Math.atan(dist / 300) / (Math.PI / 2);
    return add(point, scale(dir, height * scalar));
}

// export function getFake3dPoint(point,viewPoint, height){
//     let deep = 10
//     let s = deep / (deep + height)
//     const dir = subtract(point, viewPoint);
//     console.log(s);
//     return add(point, scale(dir, s));
// }
export function inRange (min, max, value) {
    if (value <= min) return false
    if (value >= max) return false
    return true
}

export function perpendicular (p) {
    return new Point(-p.y, p.x)
}

export function domainToRange (v, domain, range) {
    let [ds, de] = domain
    let [rs, re] = range

    return (v - ds) / (de - ds) * (re - rs) + rs
}

export function reflection (velocity, segment) {
    var normal = segment.normal(velocity)
    var d = dot(normal, velocity)
    return subtract(velocity, scale(normal, 2 * d))
}
