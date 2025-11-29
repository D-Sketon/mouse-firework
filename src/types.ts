import type { EasingTypes } from "theme-shokax-anime/dist/types";


/**
 * Options for configuring a circle shape.
 */
export type CircleOptions = {
  /**
   * The radius of the circle.
   * Can be a single number or a range [min, max].
   */
  radius: number | [number, number];
  /**
   * The opacity of the circle.
   * Can be a single number or a range [min, max].
   */
  alpha?: number | [number, number];
  /**
   * The line width of the circle border.
   * Can be a single number or a range [min, max].
   */
  lineWidth?: number | [number, number];
};

/**
 * Options for configuring a star shape.
 */
export type StarOptions = CircleOptions & {
  /**
   * The number of spikes on the star.
   * Can be a single number or a range [min, max].
   */
  spikes: number | [number, number];
};

/**
 * Options for configuring a polygon shape.
 */
export type PolygonOptions = CircleOptions & {
  /**
   * The number of sides of the polygon.
   * Can be a single number or a range [min, max].
   */
  sides: number | [number, number];
};

/**
 * Options for the 'emit' movement type.
 * Controls how particles are emitted from the center.
 */
export type EmitOptions = {
  /**
   * The radius from the center where particles are emitted.
   * Default: [50, 180]
   */
  emitRadius?: number | [number, number];
  /**
   * The radius of the particles themselves during emission.
   * Default: 0.1
   */
  radius?: number | [number, number];
  /**
   * Whether the alpha (opacity) should change during emission.
   * Default: false
   */
  alphaChange?: boolean;
  /**
   * The target alpha value.
   * Default: 0
   */
  alpha?: number | [number, number];
  /**
   * The easing function for the alpha transition.
   * Default: "linear"
   */
  alphaEasing?: EasingTypes;
  /**
   * The duration of the alpha transition.
   * Default: [600, 800]
   */
  alphaDuration?: number | [number, number];
};

/**
 * Options for the 'diffuse' movement type.
 * Controls how particles diffuse or spread out.
 */
export type DiffuseOptions = {
  /**
   * The radius to which particles diffuse.
   * Default: [80, 160]
   */
  diffuseRadius?: number | [number, number];
  /**
   * The line width of the particle during diffusion (e.g. for ring effects).
   * Default: 0
   */
  lineWidth?: number | [number, number];
  /**
   * The target alpha value.
   * Default: 0
   */
  alpha?: number | [number, number];
  /**
   * The easing function for the alpha transition.
   * Default: "linear"
   */
  alphaEasing?: EasingTypes;
  /**
   * The duration of the alpha transition.
   * Default: [600, 800]
   */
  alphaDuration?: number | [number, number];
};

/**
 * Options for the 'rotate' movement type.
 * Controls the rotation of particles.
 */
export type RotateOptions = {
  /**
   * The angle of rotation in degrees.
   * Default: [-180, 180]
   */
  angle?: number | [number, number];
};

/**
 * The type of movement for the particles.
 * - "emit": Particles move outwards from a center point.
 * - "diffuse": Particles spread out or expand.
 * - "rotate": Particles rotate.
 */
export type Move = "emit" | "diffuse" | "rotate";

/**
 * Configuration options corresponding to the movement type.
 */
export type MoveOptions = EmitOptions | DiffuseOptions | RotateOptions;

/**
 * Base options shared by all particle types.
 */
export interface BaseParticleOptions {
  /**
   * The movement type(s) for the particle.
   * Can be a single movement or an array of movements.
   */
  move: Move | Move[];
  /**
   * The options for the specified movement(s).
   * Should match the structure of the `move` property.
   */
  moveOptions?: MoveOptions | MoveOptions[];
  /**
   * The easing function for the particle's movement.
   */
  easing?: EasingTypes;
  /**
   * An array of colors for the particles.
   */
  colors: string[];
  /**
   * The number of particles to generate.
   * Can be a single number or a range [min, max].
   */
  number: number | [number, number];
  /**
   * The duration of the particle's animation.
   * Can be a single number or a range [min, max].
   */
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

/**
 * Main configuration options for the firework effect.
 */
export interface FireworkOptions {
  /**
   * A list of CSS selectors for elements that should be excluded from triggering the firework effect.
   * Clicks on these elements (or their descendants) will be ignored.
   */
  excludeElements: string[];
  /**
   * An array of particle configurations to define the firework's appearance and behavior.
   */
  particles: ParticleOptions[];
}
