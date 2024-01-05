import Anime from "./Anime";
import type { AnimeOptions } from "./types";

const anime = (options?: AnimeOptions) => {
  return new Anime(options);
};

anime.random = function (min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default anime;
