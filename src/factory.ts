import anime from "theme-shokax-anime";
// import anime from "./anime";
import BaseEntity from "./entity/BaseEntity";

import Circle from "./entity/Circle";
import Polygon from "./entity/Polygon";
import Star from "./entity/Star";
import { ParticleOptions, StarOptions, PolygonOptions } from "./types";
import { formatAlpha, sample, setEndPos, setEndRotation } from "./utils";

const preProcess = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  particle: ParticleOptions,
  shapeType: typeof Circle | typeof Polygon | typeof Star
) => {
  const num = sample(particle.number);
  let { radius, alpha = 1, lineWidth } = particle.shapeOptions;
  alpha = formatAlpha(alpha);
  const shapes: BaseEntity[] = [];
  for (let i = 0; i < num; i++) {
    const color = particle.colors[anime.random(0, particle.colors.length - 1)];
    let p: BaseEntity;
    if (shapeType === Circle) {
      p = new shapeType(
        ctx,
        x,
        y,
        color,
        sample(radius),
        sample(alpha) / 100,
        sample(lineWidth)
      );
    } else {
      p = new shapeType(
        ctx,
        x,
        y,
        color,
        sample(radius),
        sample(alpha) / 100,
        shapeType === Star
          ? sample((particle.shapeOptions as StarOptions).spikes)
          : sample((particle.shapeOptions as PolygonOptions).sides),
        sample(lineWidth)
      );
    }
    setEndPos(p, particle);
    setEndRotation(p, particle);
    shapes.push(p);
  }
  return shapes;
};

export const createCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  particle: ParticleOptions
): Circle[] => {
  return preProcess(ctx, x, y, particle, Circle) as Circle[];
};

export const createStar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  particle: ParticleOptions
): Star[] => {
  return preProcess(ctx, x, y, particle, Star) as Star[];
};

export const createPolygon = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  particle: ParticleOptions
): Polygon[] => {
  return preProcess(ctx, x, y, particle, Polygon) as Polygon[];
};
