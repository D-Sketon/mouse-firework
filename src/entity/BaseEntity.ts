export default abstract class BaseEntity {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  rotation: number;
  color: string;
  radius: number;
  alpha: number;
  lineWidth?: number;
  endPos?: { x: number; y: number };
  endRotation?: number;

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
    const { ctx, x, y } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(this.rotation * (Math.PI / 180));
    ctx.globalAlpha = this.alpha;

    let color = this.color;
    if (this.color.startsWith("var(")) {
      const [, key] = this.color.match(/var\((--[^)]+)\)/) || [];
      if (key) {
        color = getComputedStyle(document.documentElement).getPropertyValue(key).trim();
      }
    }

    this.paint();
    if (this.lineWidth) {
      ctx.lineWidth = this.lineWidth;
      ctx.strokeStyle = color;
      ctx.stroke();
    } else {
      ctx.fillStyle = color;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}
