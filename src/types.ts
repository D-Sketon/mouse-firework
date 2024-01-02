import type { EasingTypes } from "theme-shokax-anime/dist/types";

export type CircleOptions = {
  radius: number | [number, number];
  alpha?: number | [number, number];
};

export type RingOptions = {
  lineWidth: number | [number, number];
} & CircleOptions;

export enum MoveOptions {
  DIFFUSE = "diffuse",
  EMIT = "emit",
}

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

export interface ParticleOptions {
  shape: "circle" | "ring";
  move: "emit" | "diffuse";
  easing?: EasingTypes;
  colors: string[];
  number: number | [number, number];
  duration: number | [number, number];
  shapeOptions: CircleOptions | RingOptions;
  moveOptions?: EmitOptions | DiffuseOptions;
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
  color: string;
  radius: number;
  endPos: PointType;
  alpha?: number;
  lineWidth?: number;
  draw: () => void;
}
