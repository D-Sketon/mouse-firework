import type { EasingTypes } from "theme-shokax-anime/dist/types";

export type CircleOptions = {
  radius: number | [number, number];
  alpha?: number | [number, number];
  lineWidth?: number | [number, number];
};

export type StarOptions = CircleOptions & {
  spikes: number | [number, number];
};

export type PolygonOptions = CircleOptions & {
  sides: number | [number, number];
};

export type EmitOptions = {
  emitRadius?: number | [number, number]; // default [50, 180]
  radius?: number | [number, number]; // default 0.1
  alphaChange?: boolean; // default false
  alpha?: number | [number, number]; // default 0
  alphaEasing?: EasingTypes; // default linear
  alphaDuration?: number | [number, number]; // default [600, 800]
};

export type DiffuseOptions = {
  diffuseRadius?: number | [number, number]; // default [80, 160]
  lineWidth?: number | [number, number]; // for ring, default 0
  alpha?: number | [number, number]; // default 0
  alphaEasing?: EasingTypes; // default linear
  alphaDuration?: number | [number, number]; // default [600, 800]
};

export type RotateOptions = {
  angle?: number | [number, number]; // default [-180, 180]
};

export type Move = "emit" | "diffuse" | "rotate";
export type MoveOptions = EmitOptions | DiffuseOptions | RotateOptions;

export interface BaseParticleOptions {
  move: Move | Move[];
  moveOptions?: MoveOptions | MoveOptions[];
  easing?: EasingTypes;
  colors: string[];
  number: number | [number, number];
  duration: number | [number, number];
}

interface CircleParticleOptions extends BaseParticleOptions {
  shape: "circle";
  shapeOptions: CircleOptions;
}

interface StarParticleOptions extends BaseParticleOptions {
  shape: "star";
  shapeOptions: StarOptions;
}

interface PolygonParticleOptions extends BaseParticleOptions {
  shape: "polygon";
  shapeOptions: PolygonOptions;
}

export type ParticleOptions =
  | CircleParticleOptions
  | StarParticleOptions
  | PolygonParticleOptions;

export interface FireworkOptions {
  excludeElements: string[];
  particles: ParticleOptions[];
}
