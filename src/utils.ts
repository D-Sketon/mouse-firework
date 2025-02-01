import anime from "theme-shokax-anime";
// import anime from "./anime";

export const sample = (raw: number | [number, number]): number => {
  return Array.isArray(raw) ? anime.random(raw[0], raw[1]) : raw;
};

export const hasAncestor = (node: Element, name: string): boolean => {
  name = name.toUpperCase();
  while (node) {
    if (node.nodeName === name) return true;
    node = node.parentNode as Element;
  }
  return false;
};

export const formatAlpha = (alpha: number | [number, number]): [number, number] => {
  if (Array.isArray(alpha)) {
    return alpha.map((a) => a * 100) as [number, number];
  }
  return [alpha * 100, alpha * 100];
}