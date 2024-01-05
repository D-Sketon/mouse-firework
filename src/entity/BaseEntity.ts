import { PointType } from "../types";

export default abstract class BaseEntity {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  rotation: number;
  color: string;
  radius: number;
  endPos: PointType;
  endRotation: number;
  alpha: number;
  lineWidth?: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    radius: number,
    alpha: number,
    lineWidth?: number
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
    this.alpha = alpha;
    this.lineWidth = lineWidth;
    this.rotation = 0;
  }

  abstract paint(): void;

  draw() {
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(this.rotation * (Math.PI / 180));
    this.ctx.globalAlpha = this.alpha;
    this.paint();
    if (this.lineWidth) {
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.strokeStyle = this.color;
      this.ctx.stroke();
    } else {
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
    this.ctx.restore();
  }
}
