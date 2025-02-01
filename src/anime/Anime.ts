import Timeline from "./Timeline";
import { defaultOptions } from "./defaultOptions";
import engine from "./lib/engine";
import type {
  EasingTypes,
  BasicProp,
  FromToProp,
  NestProp,
  AnimeOptions,
} from "./types";

export default class Anime {
  targets?: Record<string, any> | Record<string, any>[];
  duration: number;
  easing: EasingTypes;
  update?: (targets: Record<string, any>[]) => void;
  dest: Record<
    string,
    ((...args: any[]) => string | number) | BasicProp | FromToProp | NestProp
  >;
  tl: Timeline | null;
  isPlay: boolean;
  constructor(options: Partial<AnimeOptions> = defaultOptions) {
    options = { ...defaultOptions, ...options };
    const { targets, duration, easing, update, ...dest } = options as AnimeOptions;
    this.targets = targets;
    this.duration = duration;
    this.easing = easing;
    this.update = update;
    this.dest = dest ? dest : {};
    this.tl = null;
    this.isPlay = false;
  }

  timeline() {
    if (!this.tl) {
      this.tl = new Timeline();
    }
    return this.tl;
  }

  play() {
    if (!this.isPlay) {
      this.isPlay = true;
      engine(this);
    }
  }
}
