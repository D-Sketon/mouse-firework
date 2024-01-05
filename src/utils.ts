import anime from "theme-shokax-anime";
// import anime from './anime/index'

export const sample = (raw: number | [number, number]): number => {
  return Array.isArray(raw) ? anime.random(raw[0], raw[1]) : raw;
};

export const hasAncestor = (node: Element, name: string): boolean => {
  name = name.toUpperCase();
  do {
    if (node === null || node === undefined) break;
    if (node.nodeName === name) return true;
  } while ((node = <Element>node.parentNode) !== null);
  return false;
};