import Anime from "./Anime";
import type { AnimeOptions } from "./types";

const anime = (options?: AnimeOptions) => new Anime(options);

anime.random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export default anime;