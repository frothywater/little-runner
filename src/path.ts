import { angleForB, CPoint, distanceBetween, normalVectorOf, unitVector } from "./geometry"

export default abstract class Path {
  startPoint: CPoint
  endPoint: CPoint

  constructor(startPoint: CPoint, endPoint: CPoint) {
    this.startPoint = startPoint
    this.endPoint = endPoint
  }

  abstract nextPoint(point: CPoint, distance: number): CPoint
  abstract remainingDistance(point: CPoint): number
}

export class LinearPath extends Path {
  nextPoint(point: CPoint, distance: number): CPoint {
    const ratio = distance / this.remainingDistance(point)
    return new CPoint(
      point.x + (this.endPoint.x - point.x) * ratio,
      point.y + (this.endPoint.y - point.y) * ratio
    )
  }
  remainingDistance(point: CPoint): number {
    return distanceBetween(point, this.endPoint)
  }
}

export class SemiCircularPath extends Path {
  oPoint: CPoint
  radius: number

  constructor(startPoint: CPoint, endPoint: CPoint) {
    super(startPoint, endPoint)
    this.oPoint = new CPoint((startPoint.x + endPoint.x) / 2, (startPoint.y + endPoint.y) / 2)
    this.radius = distanceBetween(startPoint, endPoint) / 2
  }

  nextPoint(point: CPoint, distance: number): CPoint {
    const angle = angleForB(this.startPoint, this.oPoint, point) + distance / this.radius
    const vector = unitVector(this.oPoint, this.startPoint)
    const nVector = normalVectorOf(vector)
    return new CPoint(
      this.oPoint.x +
        vector.x * this.radius * Math.cos(angle) +
        nVector.x * this.radius * Math.sin(angle),
      this.oPoint.y +
        vector.y * this.radius * Math.cos(angle) +
        nVector.y * this.radius * Math.sin(angle)
    )
  }

  remainingDistance(point: CPoint): number {
    return this.radius * angleForB(this.endPoint, this.oPoint, point)
  }
}
