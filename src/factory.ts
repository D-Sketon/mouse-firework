import anime from "theme-shokax-anime";
// import anime from "./anime";
import BaseEntity from "./entity/BaseEntity";

import Circle from "./entity/Circle";
import Polygon from "./entity/Polygon";
import Star from "./entity/Star";
import { ParticleOptions, StarOptions, PolygonOptions } from "./types";
import { formatAlpha, sample, setEndPos, setEndRotation } from "./utils";

const ENTITY_MAP = {
  circle: Circle,
  polygon: Polygon,
  star: Star,
};

export const entityFactory = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  particle: ParticleOptions
): BaseEntity[] => {
  const shapeType = ENTITY_MAP[particle.shape];
  const { shapeOptions, colors, number } = particle;
  let { radius, alpha = 1, lineWidth } = shapeOptions;
  alpha = formatAlpha(alpha);
  return Array.from({ length: sample(number) }, () => {
    const color = colors[anime.random(0, colors.length - 1)];
    const shapeArgs: [
      CanvasRenderingContext2D,
      number,
      number,
      string,
      number,
      number
    ] = [ctx, x, y, color, sample(radius), sample(alpha) / 100];
    if (shapeType === Star) {
      shapeArgs.push(sample((shapeOptions as StarOptions).spikes));
    } else if (shapeType === Polygon) {
      shapeArgs.push(sample((shapeOptions as PolygonOptions).sides));
    }
 
    const shape = new shapeType(...shapeArgs, sample(lineWidth!));

    setEndPos(shape, particle);
    setEndRotation(shape, particle);

    return shape;
  });
};
