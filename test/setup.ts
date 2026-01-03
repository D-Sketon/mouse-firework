import ResizeObserver from "resize-observer-polyfill";
import { JSDOM } from "jsdom";

const dom = new JSDOM(`<!DOCTYPE html><button id="test">Hello world</button>`);
global.document = dom.window.document;
Object.defineProperty(global, "navigator", {
  value: dom.window.navigator,
  writable: true,
});
// @ts-expect-error
global.window = dom.window;
global.HTMLElement = dom.window.HTMLElement;
global.getComputedStyle = dom.window.getComputedStyle;
global.ResizeObserver = ResizeObserver;
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);