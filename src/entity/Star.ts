import { sample } from "../utils";
import BaseEntity from "./BaseEntity";

export default class Star extends BaseEntity {
  spikes: number;
  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    options: {
      radius: number;
      alpha: number;
      lineWidth?: number;
      spikes: number | [number, number];
    }
  ) {
    super(ctx, x, y, color, options);
    this.spikes = sample(options.spikes);
  }

  paint(): void {
    const { ctx, spikes, radius } = this;
    ctx.beginPath();
    ctx.moveTo(0, -radius);
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const length = i % 2 === 0 ? radius : radius * 0.5;
      const px = Math.cos(angle) * length;
      const py = Math.sin(angle) * length;
      ctx.lineTo(px, py);
    }
    ctx.closePath();
  }
}
