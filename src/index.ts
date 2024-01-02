import anime from "theme-shokax-anime";
import type {
  CircleOptions,
  DiffuseOptions,
  EmitOptions,
  FireworkOptions,
  FireworkType,
  ParticleOptions,
  PointType,
  RingOptions,
} from "./types";
import { hasAncestor, sample } from "./utils";

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

const setParticleDirection = (
  p: FireworkType,
  emitRadius: number
): PointType => {
  const angle = (anime.random(0, 360) * Math.PI) / 180;
  const radius = [-1, 1][anime.random(0, 1)] * emitRadius;
  return {
    x: p.x + radius * Math.cos(angle),
    y: p.y + radius * Math.sin(angle),
  };
};

const setEndPos = (p: FireworkType, particle: ParticleOptions) => {
  const { move } = particle;
  if (move === "emit") {
    const { emitRadius = [50, 180] } =
      (particle.moveOptions as EmitOptions) ?? {};
    p.endPos = setParticleDirection(p, sample(emitRadius));
  }
};

const setParticleMovement = (particle: ParticleOptions) => {
  const { move } = particle;
  switch (move) {
    case "emit": {
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
      return {
        x: (p: FireworkType) => p.endPos.x,
        y: (p: FireworkType) => p.endPos.y,
        radius: sample(radius),
        ...alphaOptions,
      };
    }
    case "diffuse": {
      const {
        diffuseRadius = [80, 160],
        lineWidth = 0,
        alpha = 0,
        alphaEasing = "linear",
        alphaDuration = [600, 800],
      } = (particle.moveOptions as DiffuseOptions) ?? {};
      return {
        radius: sample(diffuseRadius),
        lineWidth: sample(lineWidth),
        alpha: {
          value: sample(alpha),
          easing: alphaEasing,
          duration: sample(alphaDuration),
        },
      };
    }
  }
};

const createCircle = (
  x: number,
  y: number,
  particle: ParticleOptions
): FireworkType[] => {
  const num = sample(particle.number);
  const { radius, alpha = 1 } = particle.shapeOptions as CircleOptions;
  const circles = [];
  for (let i = 0; i < num; i++) {
    const p: FireworkType = {
      x,
      y,
      color: undefined,
      radius: undefined,
      endPos: undefined,
      draw() {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      },
    };
    p.color = particle.colors[anime.random(0, particle.colors.length - 1)];
    p.radius = sample(radius);
    p.alpha = sample(alpha);
    setEndPos(p, particle);
    circles.push(p);
  }
  return circles;
};

const createRing = (
  x: number,
  y: number,
  particle: ParticleOptions
): FireworkType[] => {
  const num = sample(particle.number);
  const { radius, alpha = 1, lineWidth } = particle.shapeOptions as RingOptions;
  const rings = [];
  for (let i = 0; i < num; i++) {
    const p: FireworkType = {
      x,
      y,
      color: undefined,
      radius: undefined,
      endPos: undefined,
      draw() {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
        ctx.lineWidth = p.lineWidth;
        ctx.strokeStyle = p.color;
        ctx.stroke();
        ctx.globalAlpha = 1;
      },
    };
    p.color = particle.colors[anime.random(0, particle.colors.length - 1)];
    p.radius = sample(radius);
    p.alpha = sample(alpha);
    p.lineWidth = sample(lineWidth);
    setEndPos(p, particle);
    rings.push(p);
  }
  return rings;
};

const renderParticle = (targets: FireworkType[]): void => {
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
      targets = createCircle(x, y, particle);
    } else if (particle.shape === "ring") {
      targets = createRing(x, y, particle);
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
