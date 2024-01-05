// import anime from "theme-shokax-anime";
import anime from "./anime";
import type {
  DiffuseOptions,
  EmitOptions,
  FireworkOptions,
  ParticleOptions,
} from "./types";
import { hasAncestor, sample } from "./utils";
import BaseEntity from "./entity/BaseEntity";
import { createCircle, createStar, createPolygon } from "./factory";

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
  canvasEl.width = window.innerWidth * 2;
  canvasEl.height = window.innerHeight * 2;
  canvasEl.style.width = window.innerWidth + "px";
  canvasEl.style.height = window.innerHeight + "px";
  canvasEl.getContext("2d").scale(2, 2);
};

const updateCoords = (e: MouseEvent | TouchEvent): void => {
  pointerX =
    (e as MouseEvent).clientX ||
    ((e as TouchEvent).touches && (e as TouchEvent).touches[0].clientX);
  pointerY =
    (e as MouseEvent).clientY ||
    ((e as TouchEvent).touches && (e as TouchEvent).touches[0].clientY);
};

const setParticleMovement = (particle: ParticleOptions) => {
  const { move } = particle;
  let dist: Record<string, any> = {};
  if (move.includes("emit")) {
    const {
      radius = 0.1,
      alphaChange = false,
      alpha = 0,
      alphaEasing = "linear",
      alphaDuration = [600, 800],
    } = (particle.moveOptions as EmitOptions) ?? {};
    let alphaOptions = {};
    if (alphaChange) {
      alphaOptions = {
        alpha: {
          value: sample(alpha),
          easing: alphaEasing,
          duration: sample(alphaDuration),
        },
      };
    }
    dist = {
      ...dist,
      x: (p: BaseEntity) => p.endPos.x,
      y: (p: BaseEntity) => p.endPos.y,
      radius: sample(radius),
      ...alphaOptions,
    };
  } else if (move.includes("diffuse")) {
    const {
      diffuseRadius = [80, 160],
      lineWidth = 0,
      alpha = 0,
      alphaEasing = "linear",
      alphaDuration = [600, 800],
    } = (particle.moveOptions as DiffuseOptions) ?? {};
    dist = {
      ...dist,
      radius: sample(diffuseRadius),
      lineWidth: sample(lineWidth),
      alpha: {
        value: sample(alpha),
        easing: alphaEasing,
        duration: sample(alphaDuration),
      },
    };
  }
  if (move.includes("rotate")) {
    dist = {
      ...dist,
      rotation: (p: BaseEntity) => p.endRotation,
    };
  }
  return dist;
};

const renderParticle = (targets: BaseEntity[]): void => {
  for (const target of targets) {
    target.draw();
  }
};

const render = anime({
  duration: Infinity,
  update() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  },
});

let currentCallback = null;
let globalOptions: FireworkOptions = null;

const initFireworks = (options: FireworkOptions) => {
  globalOptions = options;
  if (currentCallback) {
    document.removeEventListener(tap, currentCallback, false);
  }
  currentCallback = (e) => {
    for (const excludeElement of options.excludeElements) {
      if (hasAncestor(<Element>e.target, excludeElement)) {
        return;
      }
    }
    render.play();
    updateCoords(e);
    animateParticles(pointerX, pointerY);
  };
  document.addEventListener(tap, currentCallback, false);
  setCanvasSize();
  window.removeEventListener("resize", setCanvasSize, false);
  window.addEventListener("resize", setCanvasSize, false);
};

const animateParticles = (x: number, y: number): void => {
  if (!globalOptions) return;
  const { particles } = globalOptions;
  const timeLine = anime().timeline();
  for (const particle of particles) {
    const { duration, easing } = particle;
    let targets = [];
    if (particle.shape === "circle") {
      targets = createCircle(ctx, x, y, particle);
    } else if (particle.shape === "star") {
      targets = createStar(ctx, x, y, particle);
    } else if (particle.shape === "polygon") {
      targets = createPolygon(ctx, x, y, particle);
    }
    const dist = setParticleMovement(particle);
    timeLine.add({
      targets,
      duration: sample(duration),
      easing,
      update: renderParticle,
      ...dist,
    });
  }
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
