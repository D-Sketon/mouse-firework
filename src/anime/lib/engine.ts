import type Anime from "../Anime";
import type { KeyFrameProp } from "../types";
import penner from "./penner";

export default (anime: Anime) => {
  // 动画开始时间
  const start = Date.now();
  // 动画结束时间
  const end = start + anime.duration;
  // target是否有效
  const isValid = !!anime.targets;
  const cloneTargets: Record<string, number | string>[] = [];

  // 初始化cloneTargets
  const initTarget = () => {
    if (!isValid) return;
    // 将targets转换为array
    if (!Array.isArray(anime.targets)) {
      anime.targets = [anime.targets];
    }
    for (const target of anime.targets as object[]) {
      const cloneTarget: Record<string, number | string> = {};
      for (const propKey in anime.dest) {
        const propValue = anime.dest[propKey];
        if (Array.isArray(propValue)) {
          // 不支持from-to模式
          // 不支持keyframe类型
        } else {
          cloneTarget[propKey] = target[propKey];
        }
      }
      cloneTargets.push(cloneTarget);
    }
  };

  // 改变target单个key的属性
  const change = (
    target: object | HTMLElement,
    origin: number,
    elapsed: number,
    value: number,
    key: string,
    final = false
  ) => {
    target[key] = final ? value : (value - origin) * elapsed + origin;
  };

  // 改变target所有的属性
  const changeAll = (elapsed: number, current: number, final = false) => {
    (anime.targets as HTMLElement[] | object[]).forEach(
      (target: HTMLElement | object, index: string | number) => {
        Object.keys(anime.dest).forEach((key) => {
          const origin = parseFloat(cloneTargets[index][key]);
          let dest = anime.dest[key];
          // 对象类型
          if (typeof dest === "object") {
            if (Array.isArray(dest)) {
              // 不支持keyframe模式
            } else {
              // nest模式
              // 支持 {value: 1, duration: 500, easing: 'linear'}
              const { value, duration, easing } = dest;
              if (current <= start + duration) {
                elapsed = penner()[easing ? easing : anime.easing]()(
                  (current - start) / duration
                );
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
      }
    );
  };

  // 核心函数，用于控制动画rAF
  const step = () => {
    const current = Date.now();
    // 已经结束，调用结束回调
    if (current > end) {
      // 数据回正
      changeAll(1, current, true);
      anime.isPlay = false;
      return;
    }
    // 还未开始，继续delay
    if (current < start) {
      requestAnimationFrame(step);
      return;
    }
    const elapsed = penner()[anime.easing]()(
      (current - start) / anime.duration
    );
    isValid && changeAll(elapsed, current);
    // 调用更新回调
    typeof anime.update == "function" &&
      anime.update(anime.targets as HTMLElement[] | object[]);
    requestAnimationFrame(step);
  };

  initTarget();
  step();
};
