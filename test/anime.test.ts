import { describe, it, expect, vi, beforeEach } from "vitest";
import Anime from "../src/anime/Anime";
import Timeline from "../src/anime/Timeline";
import engine from "../src/anime/lib/engine";

// Mock defaultOptions
vi.mock("../src/anime/defaultOptions", () => ({
  defaultOptions: {
    duration: 1000,
    easing: "linear",
  },
}));

// Mock engine
vi.mock("../src/anime/lib/engine", () => ({
  default: vi.fn(() => ({
    stop: vi.fn(),
  })),
}));

// Mock Timeline
vi.mock("../src/anime/Timeline", () => ({
  default: vi.fn(),
}));

describe("Anime", () => {
  let mockEngine: any;
  let mockTimeline: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockEngine = vi.mocked(engine);
    mockTimeline = vi.mocked(Timeline);
  });

  describe("constructor", () => {
    it("should initialize with default options", () => {
      const anime = new Anime();
      expect(anime.duration).toBe(1000);
      expect(anime.easing).toBe("linear");
      expect(anime.isPlay).toBe(false);
      expect(anime.tl).toBe(null);
      expect(anime.dest).toEqual({});
    });

    it("should initialize with custom options", () => {
      const options = {
        targets: { x: 0 },
        duration: 2000,
        easing: "easeInOutSine" as const,
        update: () => {},
        x: 100,
      };
      const anime = new Anime(options);
      expect(anime.targets).toEqual({ x: 0 });
      expect(anime.duration).toBe(2000);
      expect(anime.easing).toBe("easeInOutSine");
      expect(anime.update).toBe(options.update);
      expect(anime.dest).toEqual({ x: 100 });
      expect(anime.isPlay).toBe(false);
      expect(anime.tl).toBe(null);
    });

    it("should handle empty dest", () => {
      const anime = new Anime({ targets: {}, duration: 500 });
      expect(anime.dest).toEqual({});
    });

    it("should handle undefined dest", () => {
      const anime = new Anime({ targets: {}, duration: 500, dest: undefined });
      expect(anime.dest).toEqual({});
    });
  });

  describe("timeline", () => {
    it("should create and return a new Timeline if not exists", () => {
      const anime = new Anime();
      const tl = anime.timeline();
      expect(mockTimeline).toHaveBeenCalledTimes(1);
      expect(tl).toBeInstanceOf(Timeline);
      expect(anime.tl).toBe(tl);
    });

    it("should return existing Timeline if already created", () => {
      const anime = new Anime();
      const tl1 = anime.timeline();
      const tl2 = anime.timeline();
      expect(mockTimeline).toHaveBeenCalledTimes(1);
      expect(tl1).toBe(tl2);
    });
  });

  describe("play", () => {
    it("should start animation if not playing", () => {
      const anime = new Anime();
      anime.play();
      expect(anime.isPlay).toBe(true);
      expect(mockEngine).toHaveBeenCalledTimes(1);
      expect(mockEngine).toHaveBeenCalledWith(anime);
    });

    it("should not start animation if already playing", () => {
      const anime = new Anime();
      anime.isPlay = true;
      anime.play();
      expect(mockEngine).toHaveBeenCalledTimes(0);
    });

    it("should store stop function", () => {
      const mockStop = vi.fn();
      mockEngine.mockReturnValue({ stop: mockStop });
      const anime = new Anime();
      anime.play();
      expect((anime as any).stopFn).toBe(mockStop);
    });
  });

  describe("stop", () => {
    it("should call stop function and reset state if stopFn exists", () => {
      const mockStop = vi.fn();
      const anime = new Anime();
      (anime as any).stopFn = mockStop;
      anime.isPlay = true;

      anime.stop();

      expect(mockStop).toHaveBeenCalledTimes(1);
      expect((anime as any).stopFn).toBeUndefined();
      expect(anime.isPlay).toBe(false);
    });

    it("should do nothing if stopFn does not exist", () => {
      const anime = new Anime();
      anime.isPlay = true;

      anime.stop();

      expect(anime.isPlay).toBe(true);
    });
  });
});