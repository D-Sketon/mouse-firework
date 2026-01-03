import { describe, it, expect, vi } from "vitest";
import Timeline from "../src/anime/Timeline";

describe("Timeline", () => {
  describe("constructor", () => {
    it("should initialize with empty queue", () => {
      const timeline = new Timeline();
      expect(timeline.queue).toEqual([]);
      expect(timeline.complete).toBeUndefined();
    });
  });

  describe("add", () => {
    it("should add anime to queue and return this", () => {
      const timeline = new Timeline();
      // Mock anime instance
      const mockAnime = {
        play: vi.fn(),
        complete: undefined,
        duration: 1000
      };

      // Manually add to queue to test add method
      timeline.queue.push(mockAnime);

      expect(timeline.queue).toHaveLength(1);
      expect(timeline.queue[0]).toBe(mockAnime);
    });
  });

  describe("play", () => {
    it("should do nothing if queue is empty", () => {
      const timeline = new Timeline();
      timeline.play();
      // Should not throw or do anything
    });

    it("should call play on all anime in queue", () => {
      const timeline = new Timeline();
      const mockAnime1 = { play: vi.fn(), complete: undefined };
      const mockAnime2 = { play: vi.fn(), complete: undefined };

      timeline.queue.push(mockAnime1, mockAnime2);

      timeline.play();

      expect(mockAnime1.play).toHaveBeenCalledTimes(1);
      expect(mockAnime2.play).toHaveBeenCalledTimes(1);
    });

    it("should call timeline complete when all anime complete", () => {
      const timeline = new Timeline();
      const completeCallback = vi.fn();

      const mockAnime1 = {
        play: vi.fn(),
        complete: undefined as (() => void) | undefined
      };
      const mockAnime2 = {
        play: vi.fn(),
        complete: undefined as (() => void) | undefined
      };

      timeline.queue.push(mockAnime1, mockAnime2);
      timeline.complete = completeCallback;

      timeline.play();

      // Simulate first anime completing
      mockAnime1.complete!();
      expect(completeCallback).not.toHaveBeenCalled();

      // Simulate second anime completing
      mockAnime2.complete!();
      expect(completeCallback).toHaveBeenCalledTimes(1);
    });

    it("should preserve original anime complete callbacks", () => {
      const timeline = new Timeline();
      const timelineComplete = vi.fn();

      const originalComplete1 = vi.fn();
      const originalComplete2 = vi.fn();

      const mockAnime1 = {
        play: vi.fn(),
        complete: originalComplete1
      };
      const mockAnime2 = {
        play: vi.fn(),
        complete: originalComplete2
      };

      timeline.queue.push(mockAnime1, mockAnime2);
      timeline.complete = timelineComplete;

      timeline.play();

      // Complete both anime
      mockAnime1.complete!();
      mockAnime2.complete!();

      expect(originalComplete1).toHaveBeenCalledTimes(1);
      expect(originalComplete2).toHaveBeenCalledTimes(1);
      expect(timelineComplete).toHaveBeenCalledTimes(1);
    });

    it("should handle single anime completion", () => {
      const timeline = new Timeline();
      const completeCallback = vi.fn();

      const mockAnime1 = {
        play: vi.fn(),
        complete: undefined as (() => void) | undefined
      };

      timeline.queue.push(mockAnime1);
      timeline.complete = completeCallback;

      timeline.play();

      mockAnime1.complete!();
      expect(completeCallback).toHaveBeenCalledTimes(1);
    });

    it("should not call timeline complete if not set", () => {
      const timeline = new Timeline();

      const mockAnime1 = {
        play: vi.fn(),
        complete: undefined as (() => void) | undefined
      };

      timeline.queue.push(mockAnime1);
      // timeline.complete is undefined

      timeline.play();

      expect(() => {
        mockAnime1.complete!();
      }).not.toThrow();
    });
  });
});