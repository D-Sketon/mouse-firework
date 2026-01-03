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
      complete: vi.fn(),
      isPlay: false,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should start animation and update targets", () => {
    const stop = engine(mockAnime as Anime);

    // Advance time to start
    vi.advanceTimersByTime(0);

    expect(mockAnime.isPlay).toBe(false); // Not yet set

    // Advance to middle
    vi.advanceTimersByTime(500);
    vi.runOnlyPendingTimers();

    expect(mockAnime.update).toHaveBeenCalled();

    // Advance to end
    vi.advanceTimersByTime(500);
    vi.runOnlyPendingTimers();

    expect(mockAnime.isPlay).toBe(false);
    expect(mockAnime.complete).toHaveBeenCalledTimes(1);

    // Call stop after end, should do nothing
    stop();
  });

  it("should stop animation when stop is called", () => {
    const stop = engine(mockAnime as Anime);

    // Advance time
    vi.advanceTimersByTime(100);
    vi.runOnlyPendingTimers();

    stop();

    expect(mockAnime.isPlay).toBe(false);
    expect(mockAnime.complete).not.toHaveBeenCalled();
  });

  it("should call complete callback when animation finishes", () => {
    const completeCallback = vi.fn();
    mockAnime.complete = completeCallback;

    engine(mockAnime as Anime);

    // Advance time to end
    vi.advanceTimersByTime(1000);
    vi.runOnlyPendingTimers();

    expect(completeCallback).toHaveBeenCalledTimes(1);
  });

  it("should not call complete callback if not provided", () => {
    mockAnime.complete = undefined;

    expect(() => {
      engine(mockAnime as Anime);
      vi.advanceTimersByTime(1000);
      vi.runOnlyPendingTimers();
    }).not.toThrow();
  });
});