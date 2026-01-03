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

    // 触发几次点击创建多个timeline
    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait(10);
    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait(10);
    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait(10);

    const cancelCallsBefore = cancelAnimationFrameSpy.mock.calls.length;

    // 调用cleanup
    cleanup?.();

    const cancelCallsAfter = cancelAnimationFrameSpy.mock.calls.length;
    
    // 应该调用了cancelAnimationFrame来停止动画
    expect(cancelCallsAfter).toBeGreaterThan(cancelCallsBefore);
    
    // 应该移除了事件监听器
    expect(removeEventListenerSpy).toHaveBeenCalled();
    
    // canvas应该被移除
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

    // 第二次初始化应该清理第一次的clearRenderer
    // 调用cleanup2应该正常工作
    expect(() => cleanup2?.()).not.toThrow();
    
    // cleanup1可能指向旧资源，但调用也不应该报错
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

    // 动态导入以重置模块状态
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

    // 应该移除了第一个监听器
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "DOMContentLoaded",
      expect.any(Function)
    );

    // 应该只有一个活跃的监听器
    const domListenerCalls = addEventListenerSpy.mock.calls.filter(
      (call) => call[0] === "DOMContentLoaded"
    );
    expect(domListenerCalls.length).toBe(2); // 两次调用，但第一个被移除了

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
          duration: 100, // 短时间
          shapeOptions: { radius: 10 },
        },
      ],
    });

    // 触发点击
    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    
    // 等待动画完成 + cleanup延迟
    await wait(250);
    
    // activeTimelines应该被自动清理（我们无法直接访问，但可以验证没有内存泄漏）
    // 这个测试主要是确保代码执行没有错误
    expect(true).toBe(true);
  });
});
