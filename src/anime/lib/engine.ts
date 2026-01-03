import type Anime from "../Anime";
import penner from "./penner";

const pennerFn = penner();

const change = (
  target: Record<string, number | string>,
  origin: number,
  elapsed: number,
  value: number,
  key: string,
  final = false
) => {
  target[key] = final ? value : (value - origin) * elapsed + origin;
};

export default (anime: Anime) => {
  // Animation start time
  const start = Date.now();
  // Animation end time
  const end = start + anime.duration;

  const targetList = !anime.targets
    ? []
    : Array.isArray(anime.targets)
    ? anime.targets
    : [anime.targets];

  const cloneTargets = targetList.map((target) => {
    const cloneTarget: Record<string, number | string> = {};
    for (const propKey in anime.dest) {
      cloneTarget[propKey] = target[propKey];
    }
    return cloneTarget;
  });

  // Change all properties of target
  const changeAll = (elapsed: number, current: number, final = false) => {
    targetList.forEach((target, index) => {
      Object.keys(anime.dest).forEach((key) => {
        const origin = parseFloat(cloneTargets[index][key] as string);
        let dest = anime.dest[key];
        // Object type
        if (typeof dest === "object") {
          if (!Array.isArray(dest)) {
            // Support nest mode {value: 1, duration: 500, easing: 'linear'}
            const { value, duration, easing = anime.easing } = dest;
            const elapsed = pennerFn[easing]()((current - start) / duration);
            if (current <= start + duration) {
              change(target, origin, elapsed, value, key);
            } else if (final) {
              change(target, origin, elapsed, value, key, final);
            }
          }
        } else {
          // Function mode
          if (typeof dest === "function") {
            dest = dest(target, index);
          }
          change(target, origin, elapsed, dest as number, key, final);
        }
      });
    });
  };

  let animationId: number | null = null;

  // Control animation rAF
  const step = () => {
    const current = Date.now();
    if (current > end) {
      // Data correction
      changeAll(1, current, true);
      anime.isPlay = false;
      animationId = null;
      anime.complete?.();
    } else {
      if (current >= start) {
        changeAll(
          pennerFn[anime.easing]()((current - start) / anime.duration),
          current
        );
        anime.update?.(targetList);
      }
      animationId = requestAnimationFrame(step);
    }
  };

  const stop = () => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
      anime.isPlay = false;
    }
  };

  step();

  return stop;
};
