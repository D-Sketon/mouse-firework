import anime from "theme-shokax-anime";
// import anime from "./anime";
import BaseEntity from "./entity/BaseEntity";
import { ParticleOptions, EmitOptions, RotateOptions } from "./types";

export const sample = (raw: number | [number, number]): number => {
  return Array.isArray(raw) ? anime.random(raw[0], raw[1]) : raw;
};

export const hasAncestor = (node: Element, selector: string): boolean => {
  return !!node.closest?.(selector);
};

export const setEndPos = (p: BaseEntity, particle: ParticleOptions) => {
  const index = particle.move.indexOf("emit");
  if (index >= 0) {
    const { emitRadius = [50, 180] } =
      (particle.moveOptions as EmitOptions[])[index] || {};
    const angle = (anime.random(0, 360) * Math.PI) / 180;
    const radius = (anime.random(0, 1) ? 1 : -1) * sample(emitRadius);
    p.target.x = p.x + radius * Math.cos(angle);
    p.target.y = p.y + radius * Math.sin(angle);
  }
};

export const setEndRotation = (p: BaseEntity, particle: ParticleOptions) => {
  const index = particle.move.indexOf("rotate");
  if (index >= 0) {
    const { angle = [-180, 180] } =
      (particle.moveOptions as RotateOptions[])[index] || {};
    p.target.rotation = sample(angle);
  }
};

export const formatAlpha = (alpha: number | [number, number]) =>
  (Array.isArray(alpha) ? alpha : [alpha, alpha]).map((a) => a * 100) as [
    number,
    number
  ];
