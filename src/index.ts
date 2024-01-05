import anime from "theme-shokax-anime";
// import anime from './anime/index'
import type {
  CircleOptions,
  DiffuseOptions,
  EmitOptions,
  FireworkOptions,
  FireworkType,
  ParticleOptions,
  PointType,
  PolygonOptions,
  RotateOptions,
  StarOptions,
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
  if (move.includes("emit")) {
    const { emitRadius = [50, 180] } =
      (particle.moveOptions as EmitOptions) ?? {};
    p.endPos = setParticleDirection(p, sample(emitRadius));
  }
};

const setEndRotation = (p: FireworkType, particle: ParticleOptions) => {
  const { move } = particle;
  if (move.includes("rotate")) {
    const { angle = [-180, 180] } =
      (particle.moveOptions as RotateOptions) ?? {};
    p.endRotation = sample(angle);
  }
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
      x: (p: FireworkType) => p.endPos.x,
      y: (p: FireworkType) => p.endPos.y,
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
      rotation: (p: FireworkType) => p.endRotation,
    };
  }
  return dist;
};

const createCircle = (
  x: number,
  y: number,
  particle: ParticleOptions
): FireworkType[] => {
  const num = sample(particle.number);
  const {
    radius,
    alpha = 1,
    lineWidth,
  } = particle.shapeOptions as CircleOptions;
  const circles = [];
  for (let i = 0; i < num; i++) {
    const p: FireworkType = {
      x,
      y,
      color: undefined,
      radius: undefined,
      endPos: undefined,
      rotation: 0,
      endRotation: undefined,
      draw() {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
        if (lineWidth) {
          ctx.lineWidth = p.lineWidth;
          ctx.strokeStyle = p.color;
          ctx.stroke();
        } else {
          ctx.fillStyle = p.color;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      },
    };
    p.color = particle.colors[anime.random(0, particle.colors.length - 1)];
    p.radius = sample(radius);
    p.alpha = sample(alpha);
    if (lineWidth) {
      p.lineWidth = sample(lineWidth);
    }
    setEndPos(p, particle);
    setEndRotation(p, particle);
    circles.push(p);
  }
  return circles;
};

const createStar = (
  x: number,
  y: number,
  particle: ParticleOptions
): FireworkType[] => {
  const num = sample(particle.number);
  const { radius, alpha = 1, lineWidth } = particle.shapeOptions as StarOptions;
  const spikes = sample((particle.shapeOptions as StarOptions).spikes);
  const stars = [];
  for (let i = 0; i < num; i++) {
    const p: FireworkType = {
      x,
      y,
      color: undefined,
      radius: undefined,
      endPos: undefined,
      rotation: 0,
      endRotation: undefined,
      draw() {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * (Math.PI / 180));
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.moveTo(0, 0 - p.radius);
        for (let i = 0; i < spikes * 2; i++) {
          const angle = (i * Math.PI) / spikes - Math.PI / 2;
          const length = i % 2 === 0 ? p.radius : p.radius * 0.5;

          const px = Math.cos(angle) * length;
          const py = Math.sin(angle) * length;

          ctx.lineTo(px, py);
        }
        ctx.closePath();
        if (lineWidth) {
          ctx.lineWidth = p.lineWidth;
          ctx.strokeStyle = p.color;
          ctx.stroke();
        } else {
          ctx.fillStyle = p.color;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.restore();
      },
    };
    p.color = particle.colors[anime.random(0, particle.colors.length - 1)];
    p.radius = sample(radius);
    p.alpha = sample(alpha);
    if (lineWidth) {
      p.lineWidth = sample(lineWidth);
    }
    setEndPos(p, particle);
    setEndRotation(p, particle);
    stars.push(p);
  }
  return stars;
};

const createPolygon = (
  x: number,
  y: number,
  particle: ParticleOptions
): FireworkType[] => {
  const num = sample(particle.number);
  const {
    radius,
    alpha = 1,
    lineWidth,
  } = particle.shapeOptions as PolygonOptions;
  const polygons = [];
  const sides = sample((particle.shapeOptions as PolygonOptions).sides);
  for (let i = 0; i < num; i++) {
    const p: FireworkType = {
      x,
      y,
      color: undefined,
      radius: undefined,
      endPos: undefined,
      rotation: 0,
      endRotation: undefined,
      draw() {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * (Math.PI / 180));
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.moveTo(
          this.radius * Math.cos(0),
          this.radius * Math.sin(0)
        );

        for (let i = 1; i <= sides; i++) {
          const angle = (i * 2 * Math.PI) / sides;
          ctx.lineTo(
            this.radius * Math.cos(angle),
            this.radius * Math.sin(angle)
          );
        }
        ctx.closePath();
        if (lineWidth) {
          ctx.lineWidth = p.lineWidth;
          ctx.strokeStyle = p.color;
          ctx.stroke();
        } else {
          ctx.fillStyle = p.color;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.restore();
      },
    };
    p.color = particle.colors[anime.random(0, particle.colors.length - 1)];
    p.radius = sample(radius);
    p.alpha = sample(alpha);
    if (lineWidth) {
      p.lineWidth = sample(lineWidth);
    }
    setEndPos(p, particle);
    setEndRotation(p, particle);
    polygons.push(p);
  }
  return polygons;
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
    } else if (particle.shape === "star") {
      targets = createStar(x, y, particle);
    } else if (particle.shape === "polygon") {
      targets = createPolygon(x, y, particle);
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
