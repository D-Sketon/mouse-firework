import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import engine from "../src/anime/lib/engine";
import type Anime from "../src/anime/Anime";

describe("engine", () => {
  let mockAnime: Partial<Anime>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockAnime = {
      duration: 1000,
      easing: "linear",
      targets: [{ x: 0 }],
      dest: { x: 100 },
      update: vi.fn(),
      isPlay: false,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should start animation and update targets", () => {
    const { stop } = engine(mockAnime as Anime);

    // Advance time to start
    vi.advanceTimersByTime(0);

    expect(mockAnime.isPlay).toBe(false); // Not yet set

    // Advance to middle
    vi.advanceTimersByTime(500);

    expect(mockAnime.update).toHaveBeenCalled();

    // Advance to end
    vi.advanceTimersByTime(500);

    expect(mockAnime.isPlay).toBe(false);

    // Call stop after end, should do nothing
    stop();
  });

  it("should stop animation when stop is called", () => {
    const { stop } = engine(mockAnime as Anime);

    // Advance time
    vi.advanceTimersByTime(100);

    stop();

    expect(mockAnime.isPlay).toBe(false);
  });
});