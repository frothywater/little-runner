import { BaseBuilder, buildGPX } from "gpx-builder"
import { Point } from "gpx-builder/dist/builder/BaseBuilder/models"

class MyPoint {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

const baselinePoint = new MyPoint(30.30336, 120.086159)
const actualPoints: MyPoint[] = [
  new MyPoint(30.30563, 120.081339),
  new MyPoint(30.304565, 120.081563),
  new MyPoint(30.304692, 120.082403),
  new MyPoint(30.305756, 120.082192),
]
const earthRadius = 6371000
const xOffset = actualPoints[0].x - baselinePoint.x
const yOffset = actualPoints[0].y - baselinePoint.y
const latitudeRatio = (2 * Math.PI * earthRadius) / 360
const longitudeRatio = (2 * Math.PI * earthRadius * Math.cos((30.305 * Math.PI) / 180)) / 360
const relativePoints = actualPoints.map(
  (point) =>
    new MyPoint(
      (point.x - actualPoints[0].x) * latitudeRatio,
      (point.y - actualPoints[0].y) * longitudeRatio
    )
)

function distanceBetween(a: MyPoint, b: MyPoint) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y))
}

class State {
  point: MyPoint
  prevPointIndex: number

  constructor(x: number, y: number, prevPointIndex: number) {
    this.point = new MyPoint(x, y)
    this.prevPointIndex = prevPointIndex
  }

  get x(): number {
    return this.point.x
  }

  get y(): number {
    return this.point.y
  }

  movingBy(distance: number): State {
    const nextPoint = relativePoints[(this.prevPointIndex + 1) % 4]
    const remainingDistance = distanceBetween(this.point, nextPoint)
    if (distance <= remainingDistance) {
      const ratio = distance / remainingDistance
      const newX = this.x + (nextPoint.x - this.x) * ratio
      const newY = this.y + (nextPoint.y - this.y) * ratio
      return new State(newX, newY, this.prevPointIndex)
    } else {
      let newDistance = distance - remainingDistance
      let newState = new State(nextPoint.x, nextPoint.y, (this.prevPointIndex + 1) % 4)
      return newState.movingBy(newDistance)
    }
  }
}

export function generate(): string {
  const velocity = 3
  const interval = 5
  const totalDistance = 4000

  let currentState = new State(relativePoints[0].x, relativePoints[0].y, 0)
  let currentDistance = 0
  let currentTime = new Date()
  currentTime.setMilliseconds(0)
  const wayPoints: Point[] = []
  while (currentDistance < totalDistance) {
    const x = actualPoints[0].x + xOffset + currentState.x / latitudeRatio
    const y = actualPoints[0].y + yOffset + currentState.y / longitudeRatio
    wayPoints.push(new Point(x, y, { time: currentTime }))
    currentState = currentState.movingBy(velocity * interval)
    currentDistance += velocity * interval
    currentTime = new Date(currentTime.getTime() + interval * 1000)
  }
  const gpxBuilder = new BaseBuilder()
  gpxBuilder.setWayPoints(wayPoints)
  return buildGPX(gpxBuilder.toObject()).split(".000").join("")
}
