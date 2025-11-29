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
  // 动画开始时间
  const start = Date.now();
  // 动画结束时间
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

  // 改变target所有的属性
  const changeAll = (elapsed: number, current: number, final = false) => {
    targetList.forEach((target, index) => {
      Object.keys(anime.dest).forEach((key) => {
        const origin = parseFloat(cloneTargets[index][key] as string);
        let dest = anime.dest[key];
        // 对象类型
        if (typeof dest === "object") {
          if (!Array.isArray(dest)) {
            // 支持nest模式 {value: 1, duration: 500, easing: 'linear'}
            const { value, duration, easing = anime.easing } = dest;
            const elapsed = pennerFn[easing]()((current - start) / duration);
            if (current <= start + duration) {
              change(target, origin, elapsed, value, key);
            } else if (final) {
              change(target, origin, elapsed, value, key, final);
            }
          }
        } else {
          // function模式
          if (typeof dest === "function") {
            dest = dest(target, index);
          }
          change(target, origin, elapsed, dest as number, key, final);
        }
      });
    });
  };

  // 控制动画rAF
  const step = () => {
    const current = Date.now();
    if (current > end) {
      // 数据回正
      changeAll(1, current, true);
      anime.isPlay = false;
    } else {
      if (current >= start) {
        changeAll(
          pennerFn[anime.easing]()((current - start) / anime.duration),
          current
        );
        anime.update?.(targetList);
      }
      requestAnimationFrame(step);
    }
  };

  step();
};
