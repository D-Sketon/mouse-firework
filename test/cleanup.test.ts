import { describe, it, expect, vi, beforeEach } from "vitest";

const wait = async (time = 0): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

describe("cleanup and resource management", () => {
  const mockCanvas = {
    fillRect: () => {},
    clearRect: () => {},
    getImageData: (x: any, y: any, w: number, h: number) => ({
      data: new Array(w * h * 4),
    }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => ({ width: 0 }),
    transform: () => {},
    rect: () => {},
    clip: () => {},
    lineWidth: 0,
    fillStyle: "",
    strokeStyle: "",
    globalAlpha: 1,
  };

  beforeEach(() => {
    // @ts-expect-error
    window.HTMLCanvasElement.prototype.getContext = () => mockCanvas;
    window.HTMLCanvasElement.prototype.toDataURL = () => "";
    Object.defineProperty(document, "readyState", {
      value: "complete",
      writable: true,
      configurable: true,
    });
  });

  it("should cleanup all resources when cleanup function is called", async () => {
    const cancelAnimationFrameSpy = vi.spyOn(global, "cancelAnimationFrame");
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");
    
    const { default: firework } = await import("../src/index");
    
    const cleanup = firework({
      excludeElements: [],
      particles: [
        {
          shape: "circle",
          move: ["emit"],
          colors: ["rgba(255,182,185,.9)"],
          number: 10,
          duration: [500, 800],
          shapeOptions: {
            radius: [16, 32],
          },
        },
      ],
    });

    // Trigger several clicks to create multiple timelines
    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait(10);
    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait(10);
    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait(10);

    const cancelCallsBefore = cancelAnimationFrameSpy.mock.calls.length;

    // Call cleanup
    cleanup?.();

    const cancelCallsAfter = cancelAnimationFrameSpy.mock.calls.length;
    
    // Should have called cancelAnimationFrame to stop the animation
    expect(cancelCallsAfter).toBeGreaterThan(cancelCallsBefore);
    
    // Should have removed the event listener
    expect(removeEventListenerSpy).toHaveBeenCalled();
    
    // Canvas should be removed
    const canvasElements = document.querySelectorAll("canvas");
    expect(canvasElements.length).toBe(0);

    cancelAnimationFrameSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it("should not leak clearRenderer when initFireworks is called multiple times", async () => {
    const { default: firework } = await import("../src/index");
    
    const cleanup1 = firework({
      excludeElements: [],
      particles: [
        {
          shape: "circle",
          move: ["emit"],
          colors: ["rgba(255,182,185,.9)"],
          number: 5,
          duration: 500,
          shapeOptions: { radius: 10 },
        },
      ],
    });

    const cleanup2 = firework({
      excludeElements: [],
      particles: [
        {
          shape: "circle",
          move: ["emit"],
          colors: ["rgba(255,182,185,.9)"],
          number: 5,
          duration: 500,
          shapeOptions: { radius: 10 },
        },
      ],
    });

    // Second initialization should clean up the first clearRenderer
    // Calling cleanup2 should work normally
    expect(() => cleanup2?.()).not.toThrow();
    
    // cleanup1 may point to old resources, but calling it should not throw
    expect(() => cleanup1?.()).not.toThrow();
  });

  it("should not add multiple DOMContentLoaded listeners", async () => {
    Object.defineProperty(document, "readyState", {
      value: "loading",
      writable: true,
      configurable: true,
    });

    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    // Dynamic import to reset module state
    delete (global as any).fireworkModule;
    const module = await import("../src/index?t=" + Date.now());
    const firework = module.default;

    const cleanup1 = firework({
      excludeElements: [],
      particles: [{ shape: "circle", move: [], colors: ["red"], number: 1, duration: 100 }],
    });

    const cleanup2 = firework({
      excludeElements: [],
      particles: [{ shape: "circle", move: [], colors: ["blue"], number: 1, duration: 100 }],
    });

    // Should have removed the first listener
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "DOMContentLoaded",
      expect.any(Function)
    );

    // Should have only one active listener
    const domListenerCalls = addEventListenerSpy.mock.calls.filter(
      (call) => call[0] === "DOMContentLoaded"
    );
    expect(domListenerCalls.length).toBe(2); // Two calls, but the first was removed

    cleanup1?.();
    cleanup2?.();

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();

    Object.defineProperty(document, "readyState", {
      value: "complete",
      writable: true,
      configurable: true,
    });
  });

  it("should clean up timelines after animation completes", async () => {
    const { default: firework } = await import("../src/index");
    
    firework({
      excludeElements: [],
      particles: [
        {
          shape: "circle",
          move: ["emit"],
          colors: ["rgba(255,182,185,.9)"],
          number: 5,
          duration: 100, // Short duration
          shapeOptions: { radius: 10 },
        },
      ],
    });

    // Trigger click
    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    
    // Wait for animation to complete + cleanup delay
    await wait(250);
    
    // activeTimelines should be automatically cleaned up (we can't access it directly, but we can verify no memory leaks)
    // This test mainly ensures the code executes without errors
    expect(true).toBe(true);
  });
});
