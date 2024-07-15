import BaseEntity from "./BaseEntity";

export default class Circle extends BaseEntity {
  paint(): void {
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    this.ctx.closePath();
  }
}
