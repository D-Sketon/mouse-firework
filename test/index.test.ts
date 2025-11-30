import { JSDOM } from "jsdom";
import { describe, it, beforeEach, vi, expect } from "vitest";

const wait = async (time = 0): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

describe("firework", () => {
  const dom = new JSDOM(
    `<!DOCTYPE html><button id="test">Hello world</button>`
  );
  global.document = dom.window.document;
  Object.defineProperty(global, 'navigator', {
    value: dom.window.navigator,
    writable: true
  });
  // @ts-expect-error
  global.window = dom.window;
  global.HTMLElement = dom.window.HTMLElement;
  global.getComputedStyle = dom.window.getComputedStyle;

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

  // @ts-expect-error
  window.HTMLCanvasElement.prototype.getContext = () => mockCanvas;

  window.HTMLCanvasElement.prototype.toDataURL = () => "";

  beforeEach(() => {
    mockCanvas.rotate = () => {};
    mockCanvas.translate = () => {};
    mockCanvas.arc = () => {};
    mockCanvas.stroke = () => {};
    mockCanvas.fill = () => {};
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: true
    });
  });

  it("base call raf", async () => {
    const spy = vi.fn();
    global.requestAnimationFrame = spy;
    const { default: firework } = await import("../src/index");
    firework({
      excludeElements: [],
      particles: [
        {
          shape: "circle",
          move: ["emit"],
          colors: ["rgba(255,182,185,.9)"],
          number: 30,
          duration: [1200, 1800],
          shapeOptions: {
            radius: [16, 32],
          },
        },
      ],
    });
    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait();
    expect(spy).toHaveBeenCalled();
  });

  it("excludeElements", async () => {
    const spy = vi.fn();
    global.requestAnimationFrame = spy;
    const { default: firework } = await import("../src/index");
    firework({
      excludeElements: ["button"],
      particles: [
        {
          shape: "circle",
          move: ["emit"],
          colors: ["rgba(255,182,185,.9)"],
          number: 30,
          duration: [1200, 1800],
          shapeOptions: {
            radius: [16, 32],
          },
        },
      ],
    });

    document
      .getElementById("test")!
      .dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait();
    expect(spy).not.toHaveBeenCalled();
  });

  it("excludeElements with selector", async () => {
    const spy = vi.fn();
    global.requestAnimationFrame = spy;
    const { default: firework } = await import("../src/index");
    firework({
      excludeElements: [".ignore-class", "#ignore-id"],
      particles: [
        {
          shape: "circle",
          move: ["emit"],
          colors: ["rgba(255,182,185,.9)"],
          number: 30,
          duration: [1200, 1800],
          shapeOptions: {
            radius: [16, 32],
          },
        },
      ],
    });

    const div = document.createElement("div");
    div.className = "ignore-class";
    document.body.appendChild(div);

    const btn = document.createElement("button");
    btn.id = "ignore-id";
    document.body.appendChild(btn);

    div.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait();
    expect(spy).not.toHaveBeenCalled();

    btn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait();
    expect(spy).not.toHaveBeenCalled();
  });

  it("stroke shape - base entity", async () => {
    const translateSpy = vi.fn();
    const rotateSpy = vi.fn();
    const strokeSpy = vi.fn();
    const arcSpy = () => {
      expect(mockCanvas.globalAlpha).toBe(0.5);
    };
    global.requestAnimationFrame = () => 0;
    mockCanvas.translate = translateSpy;
    mockCanvas.rotate = rotateSpy;
    mockCanvas.stroke = strokeSpy;
    mockCanvas.arc = arcSpy;
    const { default: firework } = await import("../src/index");
    firework({
      excludeElements: [],
      particles: [
        {
          shape: "circle",
          move: [],
          colors: ["rgba(255,182,185)"],
          number: 1,
          duration: 1000,
          shapeOptions: {
            radius: 10,
            alpha: 0.5,
            lineWidth: 2,
          },
        },
      ],
    });
    document.dispatchEvent(
      new window.MouseEvent("click", { bubbles: true, clientX: 0, clientY: 0 })
    );
    await wait();
    expect(translateSpy).toHaveBeenCalledWith(0, 0);
    expect(rotateSpy).toHaveBeenCalledWith(0);
    expect(strokeSpy).toHaveBeenCalled();
    expect(mockCanvas.lineWidth).toBe(2);
    expect(mockCanvas.strokeStyle).toBe("rgba(255,182,185)");

    mockCanvas.lineWidth = 0;
    mockCanvas.strokeStyle = "";
    mockCanvas.arc = () => {};
  });

  it("fill shape - base entity", async () => {
    const translateSpy = vi.fn();
    const rotateSpy = vi.fn();
    const fillSpy = vi.fn();
    global.requestAnimationFrame = () => 0;
    mockCanvas.translate = translateSpy;
    mockCanvas.rotate = rotateSpy;
    mockCanvas.fill = () => {
      fillSpy();
      expect(mockCanvas.globalAlpha).toBeGreaterThan(0.5);
      expect(mockCanvas.globalAlpha).toBeLessThan(0.8);
    };
    const { default: firework } = await import("../src/index");
    firework({
      excludeElements: [],
      particles: [
        {
          shape: "circle",
          move: [],
          colors: ["rgba(255,182,185)"],
          number: 1,
          duration: 1000,
          shapeOptions: {
            radius: 10,
            alpha: [0.5, 0.8],
          },
        },
      ],
    });
    document.dispatchEvent(
      new window.MouseEvent("click", { bubbles: true, clientX: 0, clientY: 0 })
    );
    await wait();
    expect(translateSpy).toHaveBeenCalledWith(0, 0);
    expect(rotateSpy).toHaveBeenCalledWith(0);
    expect(fillSpy).toHaveBeenCalled();

    expect(mockCanvas.fillStyle).toBe("rgba(255,182,185)");
    mockCanvas.fillStyle = "";
  });

  it("shape - circle", async () => {
    const beginPathSpy = vi.fn();
    const arcSpy = vi.fn();
    const closePathSpy = vi.fn();
    global.requestAnimationFrame = () => 0;
    mockCanvas.beginPath = beginPathSpy;
    mockCanvas.arc = arcSpy;
    mockCanvas.closePath = closePathSpy;
    const { default: firework } = await import("../src/index");
    firework({
      excludeElements: [],
      particles: [
        {
          shape: "circle",
          move: [],
          colors: ["rgba(255,182,185)"],
          number: 1,
          duration: 1000,
          shapeOptions: {
            radius: 10,
          },
        },
      ],
    });

    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait();
    expect(beginPathSpy).toHaveBeenCalled();
    expect(arcSpy).toHaveBeenCalledWith(0, 0, 10, 0, 2 * Math.PI);
    expect(closePathSpy).toHaveBeenCalled();
  });

  it("shape - star", async () => {
    const beginPathSpy = vi.fn();
    const moveToSpy = vi.fn();
    const lineToSpy = vi.fn();
    const closePathSpy = vi.fn();
    global.requestAnimationFrame = () => 0;
    mockCanvas.beginPath = beginPathSpy;
    mockCanvas.moveTo = moveToSpy;
    mockCanvas.lineTo = lineToSpy;
    mockCanvas.closePath = closePathSpy;
    const { default: firework } = await import("../src/index");
    firework({
      excludeElements: [],
      particles: [
        {
          shape: "star",
          move: [],
          colors: ["rgba(255,182,185)"],
          number: 1,
          duration: 1000,
          shapeOptions: {
            radius: 10,
            spikes: 4,
          },
        },
      ],
    });

    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait();
    expect(beginPathSpy).toHaveBeenCalled();
    expect(moveToSpy).toHaveBeenCalledWith(0, -10);
    expect(lineToSpy).toHaveBeenCalledTimes(8);
    const baseSize = (5 * Math.sqrt(2)) / 2;
    expect(Math.abs(lineToSpy.mock.calls[0][0] - 0)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[0][1] + 10)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[1][0] - baseSize)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[1][1] + baseSize)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[2][0] - 10)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[2][1] + 0)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[3][0] - baseSize)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[3][1] - baseSize)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[4][0] + 0)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[4][1] - 10)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[5][0] + baseSize)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[5][1] - baseSize)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[6][0] + 10)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[6][1] - 0)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[7][0] + baseSize)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[7][1] + baseSize)).toBeLessThan(1e-10);
    expect(closePathSpy).toHaveBeenCalled();
  });

  it("shape - polygon", async () => {
    const beginPathSpy = vi.fn();
    const moveToSpy = vi.fn();
    const lineToSpy = vi.fn();
    const closePathSpy = vi.fn();
    global.requestAnimationFrame = () => 0;
    mockCanvas.beginPath = beginPathSpy;
    mockCanvas.moveTo = moveToSpy;
    mockCanvas.lineTo = lineToSpy;
    mockCanvas.closePath = closePathSpy;
    const { default: firework } = await import("../src/index");
    firework({
      excludeElements: [],
      particles: [
        {
          shape: "polygon",
          move: [],
          colors: ["rgba(255,182,185)"],
          number: 1,
          duration: 1000,
          shapeOptions: {
            radius: 10,
            sides: 4,
          },
        },
      ],
    });

    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait();
    expect(beginPathSpy).toHaveBeenCalled();
    expect(moveToSpy).toHaveBeenCalledWith(10, 0);
    expect(lineToSpy).toHaveBeenCalledTimes(4);
    expect(Math.abs(lineToSpy.mock.calls[0][0] - 0)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[0][1] - 10)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[1][0] + 10)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[1][1] + 0)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[2][0] + 0)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[2][1] + 10)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[3][0] - 10)).toBeLessThan(1e-10);
    expect(Math.abs(lineToSpy.mock.calls[3][1] + 0)).toBeLessThan(1e-10);
    expect(closePathSpy).toHaveBeenCalled();
  });

  it("emit", async () => {
    let i = 0;
    const translateSpy = vi.fn();
    const arcSpy = vi.fn();
    mockCanvas.translate = translateSpy;
    mockCanvas.arc = (...args) => {
      arcSpy(...args);
      const radius =
        translateSpy.mock.calls[i][0] ** 2 + translateSpy.mock.calls[i][1] ** 2;
      expect(Math.abs(radius - (i * 2) ** 2)).toBeLessThan(1e-10);
      expect(arcSpy.mock.calls[i][2]).toBe(10 - 2 * i);
      if (i < 3) {
        expect(mockCanvas.globalAlpha).toBe(1 - i / 3);
      }
      i++;
    };

    Date.now = () => i * 200;
    global.requestAnimationFrame = (cb) => {
      if (i > 5) {
        global.requestAnimationFrame = () => 0;
      }
      setTimeout(cb, 0);
      return 0;
    };
    const { default: firework } = await import("../src/index");
    firework({
      excludeElements: ["button"],
      particles: [
        {
          shape: "circle",
          move: ["emit"],
          colors: ["rgba(255,182,185)"],
          number: 1,
          duration: 1000,
          shapeOptions: {
            radius: 10,
          },
          moveOptions: {
            emitRadius: 10,
            radius: 0,
            alphaChange: true,
            alpha: 0,
            alphaEasing: "linear",
            alphaDuration: 600,
          },
        },
      ],
    });
    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait(1200);
  });

  it("diffuse", async () => {
    let i = 0;
    const translateSpy = vi.fn();
    const arcSpy = vi.fn();
    const strokeSpy = vi.fn();
    mockCanvas.translate = translateSpy;
    mockCanvas.arc = (...args) => {
      arcSpy(...args);
      expect(translateSpy).toHaveBeenCalledWith(0, 0);
      expect(arcSpy.mock.calls[i][2]).toBe(10 + 2 * i);
      if (i < 3) {
        expect(mockCanvas.globalAlpha).toBe(1 - i / 3);
      }
    };
    mockCanvas.stroke = (...args) => {
      strokeSpy(...args);
      expect(mockCanvas.lineWidth).toBe(5 - i);
      i++;
    };

    Date.now = () => i * 200;
    global.requestAnimationFrame = (cb) => {
      if (i > 4) {
        global.requestAnimationFrame = () => 0;
      }
      setTimeout(cb, 0);
      return 0;
    };
    const { default: firework } = await import("../src/index");
    firework({
      excludeElements: ["button"],
      particles: [
        {
          shape: "circle",
          move: ["diffuse"],
          colors: ["rgba(255,182,185)"],
          number: 1,
          duration: 1000,
          shapeOptions: {
            radius: 10,
            lineWidth: 5,
          },
          moveOptions: {
            diffuseRadius: 20,
            lineWidth: 0,
            alpha: 0,
            alphaEasing: "linear",
            alphaDuration: 600,
          },
        },
      ],
    });
    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait(1200);
  });

  it("rotate", async () => {
    let i = 0;
    const rotateSpy = vi.fn();
    mockCanvas.rotate = (...args) => {
      rotateSpy(...args);
      expect(rotateSpy).toHaveBeenCalledWith((Math.PI / 5) * i);
      i++;
    };

    Date.now = () => i * 200;
    global.requestAnimationFrame = (cb) => {
      if (i > 5) {
        global.requestAnimationFrame = () => 0;
      }
      setTimeout(cb, 0);
      return 0;
    };
    const { default: firework } = await import("../src/index");
    firework({
      excludeElements: ["button"],
      particles: [
        {
          shape: "circle",
          move: ["rotate"],
          colors: ["rgba(255,182,185)"],
          number: 1,
          duration: 1000,
          shapeOptions: {
            radius: 10,
          },
          moveOptions: {
            angle: 180,
          },
        },
      ],
    });
    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait(1200);
  });

  it("move with string type", async () => {
    let i = 0;
    const translateSpy = vi.fn();
    const arcSpy = vi.fn();
    mockCanvas.rotate = () => {};
    mockCanvas.translate = translateSpy;
    mockCanvas.arc = (...args) => {
      arcSpy(...args);
      const radius =
        translateSpy.mock.calls[i][0] ** 2 + translateSpy.mock.calls[i][1] ** 2;
      expect(Math.abs(radius - (i * 2) ** 2)).toBeLessThan(1e-10);
      expect(arcSpy.mock.calls[i][2]).toBe(10 - 2 * i);
      if (i < 3) {
        expect(mockCanvas.globalAlpha).toBe(1 - i / 3);
      }
      i++;
    };

    Date.now = () => i * 200;
    global.requestAnimationFrame = (cb) => {
      if (i > 5) {
        global.requestAnimationFrame = () => 0;
      }
      setTimeout(cb, 0);
      return 0;
    };
    const { default: firework } = await import("../src/index");
    firework({
      excludeElements: ["button"],
      particles: [
        {
          shape: "circle",
          move: "emit",
          colors: ["rgba(255,182,185)"],
          number: 1,
          duration: 1000,
          shapeOptions: {
            radius: 10,
          },
          moveOptions: {
            emitRadius: 10,
            radius: 0,
            alphaChange: true,
            alpha: 0,
            alphaEasing: "linear",
            alphaDuration: 600,
          },
        },
      ],
    });
    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait(1200);
  });

  it("moveOptions with array type", async () => {
    let i = 0;
    const translateSpy = vi.fn();
    const arcSpy = vi.fn();
    mockCanvas.rotate = () => {};
    mockCanvas.translate = translateSpy;
    mockCanvas.arc = (...args) => {
      arcSpy(...args);
      const radius =
        translateSpy.mock.calls[i][0] ** 2 + translateSpy.mock.calls[i][1] ** 2;
      expect(Math.abs(radius - (i * 2) ** 2)).toBeLessThan(1);
      expect(arcSpy.mock.calls[i][2]).toBe(10 - 2 * i);
      if (i < 3) {
        expect(mockCanvas.globalAlpha).toBe(1 - i / 3);
      }
      i++;
    };

    Date.now = () => i * 200;
    global.requestAnimationFrame = (cb) => {
      if (i > 5) {
        global.requestAnimationFrame = () => 0;
      }
      setTimeout(cb, 0);
      return 0;
    };
    const { default: firework } = await import("../src/index");
    firework({
      excludeElements: ["button"],
      particles: [
        {
          shape: "circle",
          move: "emit",
          colors: ["rgba(255,182,185)"],
          number: 1,
          duration: 1000,
          shapeOptions: {
            radius: 10,
          },
          moveOptions: [
            {
              emitRadius: 10,
              radius: 0,
              alphaChange: true,
              alpha: 0,
              alphaEasing: "linear",
              alphaDuration: 600,
            },
          ],
        },
      ],
    });
    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait(1200);
  });

  it("support css variable color", async () => {
    document.documentElement.style.setProperty("--test-color", "rgba(255, 0, 0, 1)");
    const fillSpy = vi.fn();
    global.requestAnimationFrame = () => 0;
    mockCanvas.fill = fillSpy;
    
    const { default: firework } = await import("../src/index");
    firework({
      excludeElements: [],
      particles: [
        {
          shape: "circle",
          move: [],
          colors: ["var(--test-color)"],
          number: 1,
          duration: 1000,
          shapeOptions: {
            radius: 10,
          },
        },
      ],
    });

    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait();
    
    expect(mockCanvas.fillStyle).toBe("rgba(255, 0, 0, 1)");
    mockCanvas.fillStyle = "";
  });

  it("init when document is loading", async () => {
    const spy = vi.fn();
    global.requestAnimationFrame = spy;
    
    // Mock document.readyState
    Object.defineProperty(document, 'readyState', {
      value: 'loading',
      writable: true
    });

    const { default: firework } = await import("../src/index");
    firework({
      excludeElements: [],
      particles: [
        {
          shape: "circle",
          move: ["emit"],
          colors: ["rgba(255,182,185,.9)"],
          number: 30,
          duration: [1200, 1800],
          shapeOptions: {
            radius: [16, 32],
          },
        },
      ],
    });

    // Trigger DOMContentLoaded
    window.dispatchEvent(new window.Event('DOMContentLoaded'));
    
    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait();
    expect(spy).toHaveBeenCalled();
  });

  it("custom entity", async () => {
    const { default: firework, registerEntity, BaseEntity } = await import("../src/index");
    
    class MyEntity extends BaseEntity {
      options: any;
      constructor(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, options: any) {
        super(ctx, x, y, color, options);
        this.options = options;
      }
      paint() {
        this.ctx.rect(0, 0, 10, 10);
      }
    }
    
    registerEntity("my-entity", MyEntity);
    
    const rectSpy = vi.fn();
    mockCanvas.rect = rectSpy;
    global.requestAnimationFrame = () => 0;

    firework({
      excludeElements: [],
      particles: [
        {
          shape: "my-entity",
          move: [],
          colors: ["red"],
          number: 1,
          duration: 1000,
          shapeOptions: {
            radius: 10,
            customProp: 123
          },
        },
      ],
    });

    document.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await wait();
    expect(rectSpy).toHaveBeenCalled();
  });
});
