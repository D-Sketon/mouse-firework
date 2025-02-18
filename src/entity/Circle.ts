import BaseEntity from "./BaseEntity";

export default class Circle extends BaseEntity {
  paint(): void {
    const { ctx } = this;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.closePath();
  }
}
