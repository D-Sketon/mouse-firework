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
    const commonArgs: [
      CanvasRenderingContext2D,
      number,
      number,
      string,
      number,
      number
    ] = [ctx, x, y, color, sample(radius), sample(alpha) / 100];
    const shapeArgs:
      | [CanvasRenderingContext2D, number, number, string, number, number]
      | [
          CanvasRenderingContext2D,
          number,
          number,
          string,
          number,
          number,
          number
        ] =
      shapeType === Circle
        ? commonArgs
        : [
            ...commonArgs,
            sample(
              shapeType === Star
                ? (particle.shapeOptions as StarOptions).spikes
                : (particle.shapeOptions as PolygonOptions).sides
            ),
          ];
    // @ts-expect-error
    const p = new shapeType(...shapeArgs, sample(lineWidth));

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
): Circle[] => preProcess(ctx, x, y, particle, Circle) as Circle[];

export const createStar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  particle: ParticleOptions
): Star[] => preProcess(ctx, x, y, particle, Star) as Star[];

export const createPolygon = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  particle: ParticleOptions
): Polygon[] => preProcess(ctx, x, y, particle, Polygon) as Polygon[];
