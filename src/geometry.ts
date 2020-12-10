export class CPoint {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

type Vector = CPoint

export function distanceBetween(a: CPoint, b: CPoint) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y))
}

function precision(n: number, digit: number): number {
  return Math.round(n * Math.pow(10, digit)) / Math.pow(10, digit)
}

export function angleForB(a: CPoint, b: CPoint, c: CPoint) {
  const lengthA = distanceBetween(b, c)
  const lengthB = distanceBetween(a, c)
  const lengthC = distanceBetween(a, b)
  const cos = (lengthA * lengthA + lengthC * lengthC - lengthB * lengthB) / (2 * lengthA * lengthC)
  return Math.acos(precision(cos, 5))
}

export function unitVector(a: CPoint, b: CPoint): Vector {
  const distance = distanceBetween(a, b)
  return new CPoint((b.x - a.x) / distance, (b.y - a.y) / distance)
}

export function normalVectorOf(vector: Vector): Vector {
  // Rotate 90 deg clockwise
  return new CPoint(vector.y, -vector.x)
}

export function jitterPoints(points: CPoint[]): CPoint[] {
  return points.map((point, index) => {
    if (index == 0) return point

    const distance = distanceBetween(points[index - 1], point)
    const jitterAmount = distance * 0.15 * (Math.random() - 0.5)
    const nVector = normalVectorOf(unitVector(points[index - 1], point))
    return new CPoint(point.x + nVector.x * jitterAmount, point.y + nVector.y * jitterAmount)
  })
}
