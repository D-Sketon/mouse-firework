import anime from "theme-shokax-anime";
// import anime from "./anime";

import Circle from "./entity/Circle";
import Polygon from "./entity/Polygon";
import Star from "./entity/Star";
import {
  ParticleOptions,
  CircleOptions,
  StarOptions,
  PolygonOptions,
} from "./types";
import { sample, setEndPos, setEndRotation } from "./utils";

export const createCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  particle: ParticleOptions
): Circle[] => {
  const num = sample(particle.number);
  let {
    radius,
    alpha = 100,
    lineWidth,
  } = particle.shapeOptions as CircleOptions;
  if (Array.isArray(alpha)) {
    alpha = alpha.map((a) => a * 100) as [number, number];
  } else {
    alpha *= 100;
  }
  const circles = [];
  for (let i = 0; i < num; i++) {
    const p = new Circle(
      ctx,
      x,
      y,
      particle.colors[anime.random(0, particle.colors.length - 1)],
      sample(radius),
      sample(alpha) / 100,
      sample(lineWidth)
    );
    setEndPos(p, particle);
    setEndRotation(p, particle);
    circles.push(p);
  }
  return circles;
};

export const createStar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  particle: ParticleOptions
): Star[] => {
  const num = sample(particle.number);
  let { radius, alpha = 100, lineWidth } = particle.shapeOptions as StarOptions;
  if (Array.isArray(alpha)) {
    alpha = alpha.map((a) => a * 100) as [number, number];
  } else {
    alpha *= 100;
  }
  const spikes = sample((particle.shapeOptions as StarOptions).spikes);
  const stars = [];
  for (let i = 0; i < num; i++) {
    const p = new Star(
      ctx,
      x,
      y,
      particle.colors[anime.random(0, particle.colors.length - 1)],
      sample(radius),
      sample(alpha) / 100,
      spikes,
      sample(lineWidth)
    );
    setEndPos(p, particle);
    setEndRotation(p, particle);
    stars.push(p);
  }
  return stars;
};

export const createPolygon = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  particle: ParticleOptions
): Polygon[] => {
  const num = sample(particle.number);
  let {
    radius,
    alpha = 100,
    lineWidth,
  } = particle.shapeOptions as PolygonOptions;
  if (Array.isArray(alpha)) {
    alpha = alpha.map((a) => a * 100) as [number, number];
  } else {
    alpha *= 100;
  }
  const polygons = [];
  const sides = sample((particle.shapeOptions as PolygonOptions).sides);
  for (let i = 0; i < num; i++) {
    const p = new Polygon(
      ctx,
      x,
      y,
      particle.colors[anime.random(0, particle.colors.length - 1)],
      sample(radius),
      sample(alpha) / 100,
      sides,
      sample(lineWidth)
    );
    setEndPos(p, particle);
    setEndRotation(p, particle);
    polygons.push(p);
  }
  return polygons;
};
