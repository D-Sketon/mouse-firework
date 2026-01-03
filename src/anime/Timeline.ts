import Anime from "./Anime";
import type { AnimeOptions } from "./types";

export default class Timeline {
  queue: Anime[] = [];
  complete?: () => void;

  add(options?: AnimeOptions) {
    this.queue.push(new Anime(options));
    return this;
  }

  play() {
    let completedCount = 0;
    const totalCount = this.queue.length;

    this.queue.forEach((anime) => {
      const originalComplete = anime.complete;
      anime.complete = () => {
        originalComplete?.();
        completedCount++;
        if (completedCount === totalCount && this.complete) {
          this.complete();
        }
      };
    });

    this.queue.forEach((instance) => instance.play());
  }
}
