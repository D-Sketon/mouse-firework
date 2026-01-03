import anime from "./anime";
import type {
  DiffuseOptions,
  EmitOptions,
  FireworkOptions,
  ParticleOptions,
  Move,
  MoveOptions,
} from "./types";
import { formatAlpha, hasAncestor, sample } from "./utils";
import BaseEntity from "./entity/BaseEntity";
import { entityFactory, registerEntity } from "./factory";
import type Anime from "./anime/Anime";
import type Timeline from "./anime/Timeline";

const tap = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  ? "touchstart"
  : "click";

let pointerX = 0;
let pointerY = 0;

const initCanvas = (): HTMLCanvasElement => {
  const canvasEl = document.createElement("canvas");
  canvasEl.style.cssText =
    "position:fixed;top:0;left:0;pointer-events:none;z-index:9999999";
  document.body.appendChild(canvasEl);
  return canvasEl;
};

const setCanvasSize = (
  canvasEl: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D | null
): void => {
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
  const { clientX, clientY } =
    (e as TouchEvent).touches?.[0] ?? (e as MouseEvent);
  pointerX = clientX;
  pointerY = clientY;
};

const getAlphaAnim = (options: EmitOptions | DiffuseOptions) => {
  const {
    alpha = 0,
    alphaEasing = "linear",
    alphaDuration = [600, 800],
  } = options;
  return {
    value: sample(formatAlpha(alpha)) / 100,
    easing: alphaEasing,
    duration: sample(alphaDuration),
  };
};

const setParticleMovement = (particle: ParticleOptions) => {
  const { move, moveOptions } = particle as {
    move: Move[];
    moveOptions: MoveOptions[];
  };
  const dist: Record<string, any> = {};
  move.forEach((m, i) => {
    const options = moveOptions[i] || {};
    if (m === "emit") {
      const { radius = 0.1, alphaChange = false } = options as EmitOptions;
      dist.x = (p: BaseEntity) => p.target.x;
      dist.y = (p: BaseEntity) => p.target.y;
      dist.radius = sample(radius);
      if (alphaChange) {
        dist.alpha = getAlphaAnim(options as EmitOptions);
      }
    } else if (m === "diffuse") {
      const { diffuseRadius = [80, 160], lineWidth = 0 } =
        options as DiffuseOptions;
      dist.radius = sample(diffuseRadius);
      dist.lineWidth = sample(lineWidth);
      dist.alpha = getAlphaAnim(options as DiffuseOptions);
    } else if (m === "rotate") {
      dist.rotation = (p: BaseEntity) => p.target.rotation!;
    }
  });
  return dist;
};

const renderParticle = (targets: BaseEntity[]): void => {
  for (const target of targets) {
    target.draw();
  }
};

let canvasEl: HTMLCanvasElement | null = null;
let currentCallback: ((e: MouseEvent | TouchEvent) => void) | null = null;
let resizeObserver: ResizeObserver | null = null;
let clearRenderer: Anime | null = null;
let activeTimelines: Timeline[] = [];
let domContentLoadedListener: (() => void) | null = null;

const initFireworks = (options: FireworkOptions) => {
  if (!canvasEl) canvasEl = initCanvas();
  const ctx = canvasEl.getContext("2d");
  if (currentCallback) {
    document.removeEventListener(tap, currentCallback, false);
  }
  // Clean up the old clearRenderer
  clearRenderer?.stop();
  clearRenderer = anime({
    duration: Infinity,
    update() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasEl!.width, canvasEl!.height);
    },
  });
  currentCallback = (e: MouseEvent | TouchEvent) => {
    if (
      options.excludeElements.some((excludeElement) =>
        hasAncestor(e.target as Element, excludeElement)
      )
    ) {
      return;
    }
    clearRenderer!.play();
    updateCoords(e);
    animateParticles(pointerX, pointerY, ctx, options);
  };
  document.addEventListener(tap, currentCallback, false);
  setCanvasSize(canvasEl, ctx);
  resizeObserver?.disconnect();
  resizeObserver = new ResizeObserver(() => setCanvasSize(canvasEl!, ctx));
  resizeObserver.observe(document.documentElement);

  return () => {
    if (currentCallback) {
      document.removeEventListener(tap, currentCallback, false);
      currentCallback = null;
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }

    activeTimelines.forEach((tl) => {
      tl.queue.forEach((anime) => anime.stop());
    });
    activeTimelines = [];
    if (clearRenderer) {
      clearRenderer.stop();
      clearRenderer = null;
    }
    if (canvasEl) {
      document.body.removeChild(canvasEl);
      canvasEl = null;
    }
  };
};

const animateParticles = (
  x: number,
  y: number,
  ctx: CanvasRenderingContext2D | null,
  options: FireworkOptions
): void => {
  if (!options || !ctx) return;
  const { particles } = options;
  const timeLine = anime().timeline();
  particles.forEach((particle) => {
    const { move, moveOptions } = particle;
    particle.move = Array.isArray(move) ? move : [move];
    particle.moveOptions = moveOptions
      ? Array.isArray(moveOptions)
        ? moveOptions
        : [moveOptions]
      : [];
    timeLine.add({
      targets: entityFactory(ctx, x, y, particle),
      duration: sample(particle.duration),
      easing: particle.easing || "linear",
      update: renderParticle as any,
      ...setParticleMovement(particle),
    });
  });

  activeTimelines.push(timeLine);
  timeLine.play();

  const maxDuration = Math.max(
    ...particles.map((p) =>
      Array.isArray(p.duration) ? p.duration[1] : p.duration
    )
  );
  setTimeout(() => {
    const index = activeTimelines.indexOf(timeLine);
    if (index > -1) activeTimelines.splice(index, 1);
  }, maxDuration + 100);
};

const firework = (options: FireworkOptions) => {
  if (document.readyState === "loading") {
    let cleanup: (() => void) | null = null;

    if (domContentLoadedListener) {
      window.removeEventListener("DOMContentLoaded", domContentLoadedListener);
    }

    domContentLoadedListener = () => {
      cleanup = initFireworks(options);
      domContentLoadedListener = null;
    };

    window.addEventListener("DOMContentLoaded", domContentLoadedListener, {
      passive: true,
    });

    return () => {
      if (domContentLoadedListener) {
        window.removeEventListener(
          "DOMContentLoaded",
          domContentLoadedListener
        );
        domContentLoadedListener = null;
      }
      cleanup?.();
    };
  } else {
    return initFireworks(options);
  }
};

firework.registerEntity = registerEntity;
firework.BaseEntity = BaseEntity;
export default firework;

export * from "./types";
export * from "./anime/types";
