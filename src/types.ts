import type { EasingTypes } from "theme-shokax-anime/dist/types";

export type CircleOptions = {
  radius: number | [number, number];
  alpha?: number | [number, number];
  lineWidth?: number | [number, number];
};

export type StarOptions = {
  radius: number | [number, number];
  spikes: number | [number, number];
  alpha?: number | [number, number];
  lineWidth?: number | [number, number];
};

export type EmitOptions = {
  emitRadius?: number | [number, number]; // default [50, 180]
  radius?: number | [number, number]; // default 0.1
  alphaChange?: boolean // default false
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

export interface ParticleOptions {
  shape: "circle" | "star";
  move: Array<"emit" | "diffuse" | "rotate">;
  easing?: EasingTypes;
  colors: string[];
  number: number | [number, number];
  duration: number | [number, number];
  shapeOptions: CircleOptions | StarOptions;
  moveOptions?: EmitOptions | DiffuseOptions | RotateOptions;
}

export interface FireworkOptions {
  excludeElements: string[];
  particles: ParticleOptions[];
}

export interface PointType {
  x: number;
  y: number;
}

export interface FireworkType {
  x: number;
  y: number;
  rotation: number;
  color: string;
  radius: number;
  endPos: PointType;
  endRotation: number;
  alpha?: number;
  lineWidth?: number;
  draw: () => void;
}
