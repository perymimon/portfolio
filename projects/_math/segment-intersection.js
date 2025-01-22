import {lerp} from './basic.js'

export function getIntersection (seg1, seg2) {
    var {p1: A, p2: B} = seg1
    var {p1: C, p2: D} = seg2
    /*
    https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
     Ix = Ax + (Bx-Ax)t = Cx + (Dx-Cx)u
     Iy = Ay + (By-Ay)y = Cy + (Dy-Cy)u

     Ax+ (Bx-Ax)t = Cx + (Dx-Cx)u | -Cx
     Ax-Cx + (Bx-Ax)t = (Dx-Cx)u

     Ay+ (By-Ay)t = Cy + (Dy-Cy)u | -Cy
     Ay-Cy + (By-Ay)t = (Dy-Cy)u  | * (Dx-Cx)

     (Dx-Cx)(Ay-Cy) + (Dx-Cx)(By-Ay)t = (Dy-Cy)(Dx-Cx)u
     (Dx-Cx)(Ay-Cy) + (Dx-Cx)(By-Ay)t =(Dy-Cy)( Ax-Cx + (Bx-Ax)t )
     (Dx-Cx)(Ay-Cy) + (Dx-Cx)(By-Ay)t =(Dy-Cy)( Ax-Cx ) + (Dy-Cy)(Bx-Ax)t | - (Dy-Cy)( Ax-Cx )
                                                                        | (Dx-Cx)(By-Ay)t
     (Dx-Cx)(Ay-Cy) - (Dy-Cy)( Ax-Cx ) = (Dy-Cy)(Bx-Ax)t - (Dx-Cx)(By-Ay)t

     t = (Dx-Cx)(Ay-Cy) - (Dy-Cy)( Ax-Cx ) / (Dy-Cy)(Bx-Ax) - (Dx-Cx)(By-Ay)

    */
    const denominator = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y)
    const eps = 0.001;
    if (!(Math.abs(denominator) > eps)) return null

    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x)
    const t = tTop / denominator

    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y)
    const u = uTop / denominator

    const maxeps = 0.999
    if ((t >= 0 && t <= 1) && (u >= 0 && u <= 1))
        return {
            x: lerp(A.x, B.x, t),
            y: lerp(A.y, B.y, t),
            offset: t > maxeps ? 1 : (t < eps ? 0 : t),
        }
    return null
}