import type { EasingFunctions } from "../types";

export default (): EasingFunctions => {
  // Based on jQuery UI's implementation of easing equations from Robert Penner (http://www.robertpenner.com/easing)
  const eases = {
    linear: () => (t: number) => t,
  };

  const functionEasings = {
    Sine: () => (t: number) => 1 - Math.cos((t * Math.PI) / 2),
    Expo: () => (t: number) => (t ? Math.pow(2, 10 * t - 10) : 0),
    Circ: () => (t: number) => 1 - Math.sqrt(1 - t * t),
    Back: () => (t: number) => t * t * (3 * t - 2),
    Bounce: () => (t: number) => {
      let pow2: number,
        b = 4;
      while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) {}
      return (
        1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2)
      );
    },
  };

  ["Quad", "Cubic", "Quart", "Quint"].forEach((name, i) => {
    functionEasings[name] = () => (t: number) => Math.pow(t, i + 2);
  });

  Object.keys(functionEasings).forEach((name) => {
    const easeIn = functionEasings[name];
    eases["easeIn" + name] = easeIn;
    eases["easeOut" + name] = () => (t: number) => 1 - easeIn()(1 - t);
    eases["easeInOut" + name] = () => (t: number) =>
      t < 0.5 ? easeIn()(t * 2) / 2 : 1 - easeIn()(t * -2 + 2) / 2;
    eases["easeOutIn" + name] = () => (t: number) =>
      t < 0.5 ? (1 - easeIn()(1 - t * 2)) / 2 : (easeIn()(t * 2 - 1) + 1) / 2;
  });
  return eases as any;
};
