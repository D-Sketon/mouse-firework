export default abstract class BaseEntity {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  rotation: number;
  color: string;
  radius: number;
  alpha: number;
  lineWidth?: number;
  target: {
    x?: number;
    y?: number;
    rotation?: number;
  } = {};

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    options: {
      radius: number;
      alpha: number;
      lineWidth?: number;
      [key: string]: any;
    }
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = color;
    if (this.color.startsWith("var(")) {
      const [, key] = this.color.match(/var\((--[^)]+)\)/) || [];
      if (key) {
        this.color =
          getComputedStyle(document.documentElement)
            .getPropertyValue(key)
            .trim() || this.color;
      }
    }
    this.radius = options.radius;
    this.alpha = options.alpha;
    this.lineWidth = options.lineWidth;
    this.rotation = 0;
  }

  abstract paint(): void;

  draw() {
    const { ctx, x, y } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(this.rotation * (Math.PI / 180));
    ctx.globalAlpha = this.alpha;

    this.paint();
    if (this.lineWidth) {
      ctx.lineWidth = this.lineWidth;
      ctx.strokeStyle = this.color;
      ctx.stroke();
    } else {
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}
