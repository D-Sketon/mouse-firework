import anime from "theme-shokax-anime";
// import anime from "./anime";
import BaseEntity from "./entity/BaseEntity";

import Circle from "./entity/Circle";
import Polygon from "./entity/Polygon";
import Star from "./entity/Star";
import { ParticleOptions } from "./types";
import { formatAlpha, sample, setEndPos, setEndRotation } from "./utils";

const ENTITY_MAP: Record<string, any> = {
  circle: Circle,
  polygon: Polygon,
  star: Star,
};

export const registerEntity = (name: string, entity: any) => {
  ENTITY_MAP[name] = entity;
};

export const entityFactory = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  particle: ParticleOptions
): BaseEntity[] => {
  const shapeType = ENTITY_MAP[particle.shape];
  const { shapeOptions, colors, number } = particle;
  let { radius = 0, alpha = 1, lineWidth = 0 } = shapeOptions || {};
  return Array.from({ length: sample(number) }, () => {
    const shape = new shapeType(
      ctx,
      x,
      y,
      colors[anime.random(0, colors.length - 1)],
      {
        ...shapeOptions,
        radius: sample(radius),
        alpha: sample(formatAlpha(alpha)) / 100,
        lineWidth: sample(lineWidth),
      }
    );

    setEndPos(shape, particle);
    setEndRotation(shape, particle);

    return shape;
  });
};
