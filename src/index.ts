import anime from "theme-shokax-anime";
// import anime from "./anime";
import type {
  DiffuseOptions,
  EmitOptions,
  RotateOptions,
  FireworkOptions,
  ParticleOptions,
} from "./types";
import { formatAlpha, hasAncestor, sample } from "./utils";
import BaseEntity from "./entity/BaseEntity";
import { entityFactory } from "./factory";

const canvasEl = document.createElement("canvas");
canvasEl.style.cssText =
  "position:fixed;top:0;left:0;pointer-events:none;z-index:9999999";
document.body.appendChild(canvasEl);
const ctx = canvasEl.getContext("2d");
const tap = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  ? "touchstart"
  : "click";

let pointerX = 0;
let pointerY = 0;

const setCanvasSize = (): void => {
  if (!ctx) return;
  const { clientWidth: width, clientHeight: height } = document.documentElement;
  canvasEl.width = width * 2;
  canvasEl.height = height * 2;
  canvasEl.style.width = width + "px";
  canvasEl.style.height = height + "px";
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(2, 2);
};

const updateCoords = (e: MouseEvent | TouchEvent): void => {
  pointerX =
    (e as MouseEvent).clientX ??
    ((e as TouchEvent).touches && (e as TouchEvent).touches[0].clientX);
  pointerY =
    (e as MouseEvent).clientY ??
    ((e as TouchEvent).touches && (e as TouchEvent).touches[0].clientY);
};

const setParticleMovement = (
  particle: ParticleOptions,
  x: number,
  y: number
) => {
  let { move, moveOptions } = particle;
  if (!Array.isArray(move)) {
    move = [move];
  }
  if (!moveOptions) moveOptions = [];
  if (!Array.isArray(moveOptions)) {
    moveOptions = [moveOptions];
  }
  let dist: Record<string, any> = {};
  move.forEach((m, i) => {
    if (m === "emit") {
      const {
        emitRadius = [50, 180],
        radius = 0.1,
        alphaChange = false,
        alphaEasing = "linear",
        alphaDuration = [600, 800],
        alpha = 0,
      } = (moveOptions[i] as EmitOptions) ?? {};
      const emitAngle = (anime.random(0, 360) * Math.PI) / 180;
      const sampledEmitRadius =
        [-1, 1][anime.random(0, 1)] * sample(emitRadius);
      dist = {
        x: () => x + sampledEmitRadius * Math.cos(emitAngle),
        y: () => y + sampledEmitRadius * Math.sin(emitAngle),
        radius: sample(radius),
      };
      if (alphaChange) {
        dist.alpha = {
          value: sample(formatAlpha(alpha)) / 100,
          easing: alphaEasing,
          duration: sample(alphaDuration),
        };
      }
    } else if (m === "diffuse") {
      const {
        diffuseRadius = [80, 160],
        lineWidth = 0,
        alphaEasing = "linear",
        alphaDuration = [600, 800],
        alpha = 0,
      } = (moveOptions[i] as DiffuseOptions) ?? {};
      dist = {
        radius: sample(diffuseRadius),
        lineWidth: sample(lineWidth),
        alpha: {
          value: sample(formatAlpha(alpha)) / 100,
          easing: alphaEasing,
          duration: sample(alphaDuration),
        },
      };
    } else if (m === "rotate") {
      const { angle = [-180, 180] } = (moveOptions[i] as RotateOptions) ?? {};
      dist.rotation = () => sample(angle);
    }
  });
  return dist;
};

const renderParticle = (targets: BaseEntity[]): void => {
  for (const target of targets) {
    target.draw();
  }
};

const clearRenderer = anime({
  duration: Infinity,
  update() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  },
});

let currentCallback: ((e: MouseEvent | TouchEvent) => void) | null = null;
let globalOptions: FireworkOptions | null = null;

const initFireworks = (options: FireworkOptions) => {
  globalOptions = options;
  if (currentCallback) {
    document.removeEventListener(tap, currentCallback, false);
  }
  currentCallback = (e: MouseEvent | TouchEvent) => {
    if (
      options.excludeElements.some((excludeElement) =>
        hasAncestor(e.target as Element, excludeElement)
      )
    ) {
      return;
    }
    clearRenderer.play();
    updateCoords(e);
    animateParticles(pointerX, pointerY);
  };
  document.addEventListener(tap, currentCallback, false);
  setCanvasSize();
  window.removeEventListener("resize", setCanvasSize, false);
  window.addEventListener("resize", setCanvasSize, false);
};

const animateParticles = (x: number, y: number): void => {
  if (!globalOptions || !ctx) return;
  const { particles } = globalOptions;
  const timeLine = anime().timeline();
  particles.forEach((particle) => {
    timeLine.add({
      targets: entityFactory(ctx, x, y, particle),
      duration: sample(particle.duration),
      easing: particle.easing ?? "linear",
      update: renderParticle as any,
      ...setParticleMovement(particle, x, y),
    });
  });
  timeLine.play();
};

export default (options: FireworkOptions) => {
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", () => initFireworks(options), {
      passive: true,
    });
  } else {
    initFireworks(options);
  }
};
