import Timeline from "./Timeline";
import { defaultOptions } from "./defaultOptions";
import engine from "./lib/engine";
import type {
  EasingTypes,
  BasicProp,
  FromToProp,
  NestProp,
  KeyFrameProp,
  AnimeOptions,
} from "./types";

export default class Anime {
  targets: object | object[];
  duration: number;
  easing: EasingTypes;
  update?: (targets: object[]) => void;
  dest: Record<
    string,
    | ((...args: any[]) => string | number)
    | BasicProp
    | FromToProp
    | NestProp
    | KeyFrameProp
  >;
  tl: Timeline;
  isPlay: boolean;
  constructor(options: AnimeOptions = defaultOptions) {
    options = Object.assign({}, defaultOptions, options);
    const {
      targets,
      duration,
      easing,
      update,
      ...dest
    } = options;
    this.targets = targets;
    this.duration = duration;
    this.easing = easing;
    this.update = update;
    this.dest = dest ? dest : {};
    this.tl = null;
    this.isPlay = false;
  }

  timeline() {
    if (this.tl === null) {
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
