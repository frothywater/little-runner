import { BaseBuilder, buildGPX } from "gpx-builder"
import { Point } from "gpx-builder/dist/builder/BaseBuilder/models"
import Cycle from "./cycle"
import { CPoint, distanceBetween, jitterPoints } from "./geometry"
import { LinearPath, SemiCircularPath } from "./path"

const baselinePoint = new CPoint(30.30336, 120.086159)
const actualPoints: CPoint[] = [
  new CPoint(30.305559, 120.081393),
  new CPoint(30.304696, 120.081574),
  new CPoint(30.304813, 120.082311),
  new CPoint(30.305666, 120.082118),
]

const earthRadius = 6371000
const xOffset = actualPoints[0].x - baselinePoint.x
const yOffset = actualPoints[0].y - baselinePoint.y
const latitudeRatio = (2 * Math.PI * earthRadius) / 360
const longitudeRatio = (2 * Math.PI * earthRadius * Math.cos((30.305 * Math.PI) / 180)) / 360
const relativePoints = actualPoints.map(
  (point) =>
    new CPoint(
      (point.x - actualPoints[0].x) * latitudeRatio,
      (point.y - actualPoints[0].y) * longitudeRatio
    )
)
const paths = [
  new LinearPath(relativePoints[0], relativePoints[1]),
  new SemiCircularPath(relativePoints[1], relativePoints[2]),
  new LinearPath(relativePoints[2], relativePoints[3]),
  new SemiCircularPath(relativePoints[3], relativePoints[0]),
]

export function generate(): string {
  const interval = 5
  const totalDistance = 4350
  const duration = 12 * 60
  const velocity = totalDistance / duration

  let currentDistance = 0
  let currentTime = new Date()
  currentTime.setMilliseconds(0)
  const cycle = new Cycle(paths)
  const points: CPoint[] = []
  const dates: Date[] = []

  console.log(distanceBetween(relativePoints[0], relativePoints[1]))

  while (currentDistance < totalDistance) {
    points.push(new CPoint(cycle.currentX, cycle.currentY))
    dates.push(currentTime)

    cycle.advanceBy(velocity * interval)
    currentDistance += velocity * interval
    currentTime = new Date(currentTime.getTime() + interval * 1000)
  }

  const wayPoints = jitterPoints(points).map(
    (point, index) =>
      new Point(
        actualPoints[0].x + xOffset + point.x / latitudeRatio,
        actualPoints[0].y + yOffset + point.y / longitudeRatio,
        { time: dates[index] }
      )
  )
  const gpxBuilder = new BaseBuilder()
  gpxBuilder.setWayPoints(wayPoints)
  return buildGPX(gpxBuilder.toObject()).split(".000").join("")
}
