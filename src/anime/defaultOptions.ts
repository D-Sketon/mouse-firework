import type { AnimeOptions } from "./types";

export const defaultOptions: AnimeOptions = {
  targets: null,
  duration: Infinity,
  easing: "linear",
  update: null, // 更新回调
};
