import { CPoint } from "./geometry"
import Path from "./path"

export default class Cycle {
  private paths: Path[]
  private currentPoint: CPoint
  private currentPathIndex: number

  constructor(paths: Path[]) {
    this.paths = paths
    this.currentPoint = paths[0].startPoint
    this.currentPathIndex = 0
  }

  get currentX(): number {
    return this.currentPoint.x
  }
  get currentY(): number {
    return this.currentPoint.y
  }

  advanceBy(distance: number) {
    const currentPath = this.paths[this.currentPathIndex]
    const remainingDistance = currentPath.remainingDistance(this.currentPoint)
    if (distance < remainingDistance) {
      this.currentPoint = currentPath.nextPoint(this.currentPoint, distance)
    } else {
      this.currentPoint = currentPath.endPoint
      this.currentPathIndex = (this.currentPathIndex + 1) % this.paths.length
      this.advanceBy(distance - remainingDistance)
    }
  }
}
