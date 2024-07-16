import anime from "theme-shokax-anime";
// import anime from "./anime";
import type {
  DiffuseOptions,
  EmitOptions,
  FireworkOptions,
  ParticleOptions,
} from "./types";
import { formatAlpha, hasAncestor, sample } from "./utils";
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

const setParticleMovement = (particle: ParticleOptions) => {
  const { move, moveOptions } = particle;
  let dist: Record<string, any> = {};
  if (move.includes("emit")) {
    const {
      radius = 0.1,
      alphaChange = false,
      alphaEasing = "linear",
      alphaDuration = [600, 800],
      alpha = 0,
    } = (moveOptions as EmitOptions) ?? {};
    dist = {
      x: (p: BaseEntity) => p.endPos.x,
      y: (p: BaseEntity) => p.endPos.y,
      radius: sample(radius),
    };
    if (alphaChange) {
      dist.alpha = {
        value: sample(formatAlpha(alpha)) / 100,
        easing: alphaEasing,
        duration: sample(alphaDuration),
      };
    }
  } else if (move.includes("diffuse")) {
    const {
      diffuseRadius = [80, 160],
      lineWidth = 0,
      alphaEasing = "linear",
      alphaDuration = [600, 800],
      alpha = 0,
    } = (moveOptions as DiffuseOptions) ?? {};
    dist = {
      radius: sample(diffuseRadius),
      lineWidth: sample(lineWidth),
      alpha: {
        value: sample(formatAlpha(alpha)) / 100,
        easing: alphaEasing,
        duration: sample(alphaDuration),
      },
    };
  }
  if (move.includes("rotate")) {
    dist.rotation = (p: BaseEntity) => p.endRotation;
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
  currentCallback = (e: MouseEvent | TouchEvent) => {
    if (
      options.excludeElements.some((excludeElement) =>
        hasAncestor(e.target as Element, excludeElement)
      )
    ) {
      return;
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
  particles.forEach((particle) => {
    let targets = [];
    switch (particle.shape) {
      case "circle":
        targets = createCircle(ctx, x, y, particle);
        break;
      case "star":
        targets = createStar(ctx, x, y, particle);
        break;
      case "polygon":
        targets = createPolygon(ctx, x, y, particle);
    }
    timeLine.add({
      targets,
      duration: sample(particle.duration),
      easing: particle.easing ?? "linear",
      update: renderParticle,
      ...setParticleMovement(particle),
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
