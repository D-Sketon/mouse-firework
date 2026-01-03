import type { AnimeOptions } from "./types";

export const defaultOptions: AnimeOptions = {
  targets: undefined,
  duration: Infinity,
  easing: "linear",
  update: undefined, // Update callback
};
