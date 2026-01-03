import { describe, it, expect } from "vitest";
import penner from "../src/anime/lib/penner";

describe("penner", () => {
  const eases = penner();

  it("should return an object with easing functions", () => {
    expect(typeof eases).toBe("object");
    expect(typeof eases.linear).toBe("function");
    expect(typeof eases.easeInQuad).toBe("function");
    expect(typeof eases.easeOutQuad).toBe("function");
    expect(typeof eases.easeInOutQuad).toBe("function");
    expect(typeof eases.easeOutInQuad).toBe("function");
  });

  it("should have linear easing", () => {
    const linear = eases.linear();
    expect(linear(0)).toBe(0);
    expect(linear(0.5)).toBe(0.5);
    expect(linear(1)).toBe(1);
  });

  it("should have easeInQuad easing", () => {
    const easeInQuad = eases.easeInQuad();
    expect(easeInQuad(0)).toBe(0);
    expect(easeInQuad(0.5)).toBe(0.25);
    expect(easeInQuad(1)).toBe(1);
  });

  it("should have easeOutQuad easing", () => {
    const easeOutQuad = eases.easeOutQuad();
    expect(easeOutQuad(0)).toBe(0);
    expect(easeOutQuad(0.5)).toBe(0.75);
    expect(easeOutQuad(1)).toBe(1);
  });

  it("should have easeInOutQuad easing", () => {
    const easeInOutQuad = eases.easeInOutQuad();
    expect(easeInOutQuad(0)).toBe(0);
    expect(easeInOutQuad(0.5)).toBe(0.5);
    expect(easeInOutQuad(1)).toBe(1);
  });

  it("should have easeOutInQuad easing", () => {
    const easeOutInQuad = eases.easeOutInQuad();
    expect(easeOutInQuad(0)).toBe(0);
    expect(easeOutInQuad(0.5)).toBe(0.5);
    expect(easeOutInQuad(1)).toBe(1);
  });

  it("should have easeInCubic easing", () => {
    const easeInCubic = eases.easeInCubic();
    expect(easeInCubic(0)).toBe(0);
    expect(easeInCubic(0.5)).toBe(0.125);
    expect(easeInCubic(1)).toBe(1);
  });

  it("should have easeOutCubic easing", () => {
    const easeOutCubic = eases.easeOutCubic();
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(0.5)).toBe(0.875);
    expect(easeOutCubic(1)).toBe(1);
  });

  it("should have easeInOutCubic easing", () => {
    const easeInOutCubic = eases.easeInOutCubic();
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(0.5)).toBe(0.5);
    expect(easeInOutCubic(1)).toBe(1);
  });

  it("should have easeOutInCubic easing", () => {
    const easeOutInCubic = eases.easeOutInCubic();
    expect(easeOutInCubic(0)).toBe(0);
    expect(easeOutInCubic(0.5)).toBe(0.5);
    expect(easeOutInCubic(1)).toBe(1);
  });

  it("should have easeInSine easing", () => {
    const easeInSine = eases.easeInSine();
    expect(easeInSine(0)).toBe(0);
    expect(easeInSine(1)).toBeCloseTo(1);
  });

  it("should have easeOutSine easing", () => {
    const easeOutSine = eases.easeOutSine();
    expect(easeOutSine(0)).toBeCloseTo(0);
    expect(easeOutSine(1)).toBe(1);
  });

  it("should have easeInOutSine easing", () => {
    const easeInOutSine = eases.easeInOutSine();
    expect(easeInOutSine(0)).toBe(0);
    expect(easeInOutSine(0.5)).toBe(0.5);
    expect(easeInOutSine(1)).toBe(1);
  });

  it("should have easeOutInSine easing", () => {
    const easeOutInSine = eases.easeOutInSine();
    expect(easeOutInSine(0)).toBeCloseTo(0);
    expect(easeOutInSine(0.5)).toBe(0.5);
    expect(easeOutInSine(1)).toBe(1);
  });

  it("should have easeInExpo easing", () => {
    const easeInExpo = eases.easeInExpo();
    expect(easeInExpo(0)).toBe(0);
    expect(easeInExpo(1)).toBe(1);
  });

  it("should have easeOutExpo easing", () => {
    const easeOutExpo = eases.easeOutExpo();
    expect(easeOutExpo(0)).toBe(0);
    expect(easeOutExpo(1)).toBe(1);
  });

  it("should have easeInOutExpo easing", () => {
    const easeInOutExpo = eases.easeInOutExpo();
    expect(easeInOutExpo(0)).toBe(0);
    expect(easeInOutExpo(0.5)).toBe(0.5);
    expect(easeInOutExpo(1)).toBe(1);
  });

  it("should have easeOutInExpo easing", () => {
    const easeOutInExpo = eases.easeOutInExpo();
    expect(easeOutInExpo(0)).toBe(0);
    expect(easeOutInExpo(0.5)).toBe(0.5);
    expect(easeOutInExpo(1)).toBe(1);
  });

  it("should have easeInCirc easing", () => {
    const easeInCirc = eases.easeInCirc();
    expect(easeInCirc(0)).toBe(0);
    expect(easeInCirc(1)).toBe(1);
  });

  it("should have easeOutCirc easing", () => {
    const easeOutCirc = eases.easeOutCirc();
    expect(easeOutCirc(0)).toBe(0);
    expect(easeOutCirc(1)).toBe(1);
  });

  it("should have easeInOutCirc easing", () => {
    const easeInOutCirc = eases.easeInOutCirc();
    expect(easeInOutCirc(0)).toBe(0);
    expect(easeInOutCirc(0.5)).toBe(0.5);
    expect(easeInOutCirc(1)).toBe(1);
  });

  it("should have easeOutInCirc easing", () => {
    const easeOutInCirc = eases.easeOutInCirc();
    expect(easeOutInCirc(0)).toBe(0);
    expect(easeOutInCirc(0.5)).toBe(0.5);
    expect(easeOutInCirc(1)).toBe(1);
  });

  it("should have easeInBack easing", () => {
    const easeInBack = eases.easeInBack();
    expect(easeInBack(0)).toBeCloseTo(0);
    expect(easeInBack(1)).toBe(1);
  });

  it("should have easeOutBack easing", () => {
    const easeOutBack = eases.easeOutBack();
    expect(easeOutBack(0)).toBe(0);
    expect(easeOutBack(1)).toBe(1);
  });

  it("should have easeInOutBack easing", () => {
    const easeInOutBack = eases.easeInOutBack();
    expect(easeInOutBack(0)).toBeCloseTo(0);
    expect(easeInOutBack(0.5)).toBe(0.5);
    expect(easeInOutBack(1)).toBe(1);
  });

  it("should have easeOutInBack easing", () => {
    const easeOutInBack = eases.easeOutInBack();
    expect(easeOutInBack(0)).toBe(0);
    expect(easeOutInBack(0.5)).toBe(0.5);
    expect(easeOutInBack(1)).toBe(1);
  });

  it("should have easeInBounce easing", () => {
    const easeInBounce = eases.easeInBounce();
    expect(easeInBounce(0)).toBe(0);
    expect(easeInBounce(1)).toBe(1);
  });

  it("should have easeOutBounce easing", () => {
    const easeOutBounce = eases.easeOutBounce();
    expect(easeOutBounce(0)).toBe(0);
    expect(easeOutBounce(1)).toBe(1);
  });

  it("should have easeInOutBounce easing", () => {
    const easeInOutBounce = eases.easeInOutBounce();
    expect(easeInOutBounce(0)).toBe(0);
    expect(easeInOutBounce(0.5)).toBe(0.5);
    expect(easeInOutBounce(1)).toBe(1);
  });

  it("should have easeOutInBounce easing", () => {
    const easeOutInBounce = eases.easeOutInBounce();
    expect(easeOutInBounce(0)).toBe(0);
    expect(easeOutInBounce(0.5)).toBe(0.5);
    expect(easeOutInBounce(1)).toBe(1);
  });

  it("should have easeInQuart easing", () => {
    const easeInQuart = eases.easeInQuart();
    expect(easeInQuart(0)).toBe(0);
    expect(easeInQuart(0.5)).toBe(0.0625);
    expect(easeInQuart(1)).toBe(1);
  });

  it("should have easeOutQuart easing", () => {
    const easeOutQuart = eases.easeOutQuart();
    expect(easeOutQuart(0)).toBe(0);
    expect(easeOutQuart(0.5)).toBe(0.9375);
    expect(easeOutQuart(1)).toBe(1);
  });

  it("should have easeInOutQuart easing", () => {
    const easeInOutQuart = eases.easeInOutQuart();
    expect(easeInOutQuart(0)).toBe(0);
    expect(easeInOutQuart(0.5)).toBe(0.5);
    expect(easeInOutQuart(1)).toBe(1);
  });

  it("should have easeOutInQuart easing", () => {
    const easeOutInQuart = eases.easeOutInQuart();
    expect(easeOutInQuart(0)).toBe(0);
    expect(easeOutInQuart(0.5)).toBe(0.5);
    expect(easeOutInQuart(1)).toBe(1);
  });

  it("should have easeInQuint easing", () => {
    const easeInQuint = eases.easeInQuint();
    expect(easeInQuint(0)).toBe(0);
    expect(easeInQuint(0.5)).toBe(0.03125);
    expect(easeInQuint(1)).toBe(1);
  });

  it("should have easeOutQuint easing", () => {
    const easeOutQuint = eases.easeOutQuint();
    expect(easeOutQuint(0)).toBe(0);
    expect(easeOutQuint(0.5)).toBe(0.96875);
    expect(easeOutQuint(1)).toBe(1);
  });

  it("should have easeInOutQuint easing", () => {
    const easeInOutQuint = eases.easeInOutQuint();
    expect(easeInOutQuint(0)).toBe(0);
    expect(easeInOutQuint(0.5)).toBe(0.5);
    expect(easeInOutQuint(1)).toBe(1);
  });

  it("should have easeOutInQuint easing", () => {
    const easeOutInQuint = eases.easeOutInQuint();
    expect(easeOutInQuint(0)).toBe(0);
    expect(easeOutInQuint(0.5)).toBe(0.5);
    expect(easeOutInQuint(1)).toBe(1);
  });
});