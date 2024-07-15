import chai from "chai";
const should = chai.should();
import { JSDOM } from "jsdom";
import sinon from "sinon";

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
  global.navigator = dom.window.navigator;
  // @ts-expect-error
  global.window = dom.window;
  global.HTMLElement = dom.window.HTMLElement;

  const mockCanvas = {
    fillRect: () => {},
    clearRect: () => {},
    getImageData: (x, y, w, h) => ({
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

  it("base call raf", async () => {
    const spy = sinon.spy();
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
    spy.called.should.be.true;
  });

  it("excludeElements", async () => {
    const spy = sinon.spy();
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
    spy.called.should.be.false;
  });

  it("stroke shape - base entity", async () => {
    const translateSpy = sinon.spy();
    const rotateSpy = sinon.spy();
    const strokeSpy = sinon.spy();
    const arcSpy = () => {
      mockCanvas.globalAlpha.should.eql(0.5);
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
    translateSpy.args[0].should.eql([0, 0]);
    rotateSpy.args[0].should.eql([0]);
    strokeSpy.called.should.be.true;
    mockCanvas.lineWidth.should.eql(2);
    mockCanvas.strokeStyle.should.eql("rgba(255,182,185)");

    mockCanvas.lineWidth = 0;
    mockCanvas.strokeStyle = "";
    mockCanvas.arc = () => {};
  });

  it("fill shape - base entity", async () => {
    const translateSpy = sinon.spy();
    const rotateSpy = sinon.spy();
    const fillSpy = sinon.spy();
    global.requestAnimationFrame = () => 0;
    mockCanvas.translate = translateSpy;
    mockCanvas.rotate = rotateSpy;
    mockCanvas.fill = fillSpy;
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
    document.dispatchEvent(
      new window.MouseEvent("click", { bubbles: true, clientX: 0, clientY: 0 })
    );
    await wait();
    translateSpy.args[0].should.eql([0, 0]);
    rotateSpy.args[0].should.eql([0]);
    fillSpy.called.should.be.true;

    mockCanvas.fillStyle.should.eql("rgba(255,182,185)");
    mockCanvas.fillStyle = "";
  });

  it("shape - circle", async () => {
    const beginPathSpy = sinon.spy();
    const arcSpy = sinon.spy();
    const closePathSpy = sinon.spy();
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
    beginPathSpy.called.should.be.true;
    arcSpy.args[0].should.eql([0, 0, 10, 0, 2 * Math.PI]);
    closePathSpy.called.should.be.true;
  });

  it("shape - star", async () => {
    const beginPathSpy = sinon.spy();
    const moveToSpy = sinon.spy();
    const lineToSpy = sinon.spy();
    const closePathSpy = sinon.spy();
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
    beginPathSpy.called.should.be.true;
    moveToSpy.args[0].should.eql([0, -10]);
    lineToSpy.callCount.should.eql(8);
    const baseSize = (5 * Math.sqrt(2)) / 2;
    (Math.abs(lineToSpy.args[0][0] - 0) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[0][1] + 10) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[1][0] - baseSize) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[1][1] + baseSize) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[2][0] - 10) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[2][1] + 0) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[3][0] - baseSize) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[3][1] - baseSize) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[4][0] + 0) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[4][1] - 10) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[5][0] + baseSize) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[5][1] - baseSize) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[6][0] + 10) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[6][1] - 0) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[7][0] + baseSize) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[7][1] + baseSize) < 1e-10).should.be.true;
    closePathSpy.called.should.be.true;
  });

  it("shape - polygon", async () => {
    const beginPathSpy = sinon.spy();
    const moveToSpy = sinon.spy();
    const lineToSpy = sinon.spy();
    const closePathSpy = sinon.spy();
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
    beginPathSpy.called.should.be.true;
    moveToSpy.args[0].should.eql([10, 0]);
    lineToSpy.callCount.should.eql(4);
    (Math.abs(lineToSpy.args[0][0] - 0) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[0][1] - 10) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[1][0] + 10) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[1][1] + 0) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[2][0] + 0) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[2][1] + 10) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[3][0] - 10) < 1e-10).should.be.true;
    (Math.abs(lineToSpy.args[3][1] + 0) < 1e-10).should.be.true;
    closePathSpy.called.should.be.true;
  });

  it("emit", async () => {
    let i = 0;
    const translateSpy = sinon.spy();
    const arcSpy = sinon.spy();
    mockCanvas.translate = translateSpy;
    mockCanvas.arc = (...args) => {
      arcSpy(...args);
      const radius =
        translateSpy.args[i][0] ** 2 + translateSpy.args[i][1] ** 2;
      (Math.abs(radius - (i * 2) ** 2) < 1e-10).should.be.true;
      arcSpy.args[i][2].should.eql(10 - 2 * i);
      if (i < 3) {
        mockCanvas.globalAlpha.should.eql(1 - i / 3);
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
    const translateSpy = sinon.spy();
    const arcSpy = sinon.spy();
    const strokeSpy = sinon.spy();
    mockCanvas.translate = translateSpy;
    mockCanvas.arc = (...args) => {
      arcSpy(...args);
      translateSpy.args[i].should.eql([0, 0]);
      arcSpy.args[i][2].should.eql(10 + 2 * i);
      if (i < 3) {
        mockCanvas.globalAlpha.should.eql(1 - i / 3);
      }
    };
    mockCanvas.stroke = (...args) => {
      strokeSpy(...args);
      mockCanvas.lineWidth.should.eql(5 - i);
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
    const rotateSpy = sinon.spy();
    mockCanvas.rotate = (...args) => {
      rotateSpy(...args);
      rotateSpy.args[i][0].should.eql(Math.PI / 5 * i);
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
});
