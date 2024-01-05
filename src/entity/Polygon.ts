import BaseEntity from "./BaseEntity";

export default class Polygon extends BaseEntity {
  sides: number;
  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    radius: number,
    alpha: number,
    sides: number,
    lineWidth?: number
  ) {
    super(ctx, x, y, color, radius, alpha, lineWidth);
    this.sides = sides;
  }

  paint(): void {
    const { ctx, sides, radius } = this;
    ctx.beginPath();
    ctx.moveTo(radius * Math.cos(0), radius * Math.sin(0));

    for (let i = 1; i <= sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
    }
    ctx.closePath();
  }
}
