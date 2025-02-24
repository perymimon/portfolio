import Point from '../_glossary/primitive/Point.primitive.js'

export function hilbert (i, order) {
    let v = new Point(0, 0)
    for (let d = 0; d < order; d++) {
        let mask = i >> (d * 2)
        let len = (2 ** d)
        switch (mask & 3) {
            case 0:
                v.swapMainDiagonal()
                break;
            case 1:
                v.translate({x: 0, y: len})
                break;
            case 2:
                v.translate({x: len, y: len})
                break;
            case 3:
                v.swapSecondDiagonal(len - 1)
                    .translate({x: len, y: 0})
        }
    }
    return v
}
// console.log(path.join('\n'))
