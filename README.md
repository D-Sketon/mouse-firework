<div align = center>
  <img src="https://fastly.jsdelivr.net/gh/D-Sketon/blog-img/mouse-firework.gif"/>
  <h1>mouse-firework</h1>
  <img alt="NPM License" src="https://img.shields.io/npm/l/mouse-firework">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/mouse-firework">
  <img alt="NPM Bundle Size" src="https://img.shields.io/bundlephobia/minzip/mouse-firework">
  <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/mouse-firework">
  <img alt="jsDelivr hits (npm)" src="https://img.shields.io/jsdelivr/npm/hm/mouse-firework">
  <a href='https://coveralls.io/github/D-Sketon/mouse-firework?branch=main'><img src='https://coveralls.io/repos/github/D-Sketon/mouse-firework/badge.svg?branch=main' alt='Coverage Status' /></a>

  [Demo](https://d-sketon.github.io/mouse-firework)
</div>

---

Fireworks effects appear when you click the mouse. Ideal for insertion in blogs and other such sites

## Usage

### Import

from npm

```bash
npm i mouse-firework --save
```

or just use it in your browser

```html
<script src="https://cdn.jsdelivr.net/npm/mouse-firework@latest/dist/index.umd.js"></script>
```

### Basic Usage

Just one line of code

```js
firework(<options>)
```

e.g.

```html
<script>
  firework({
    excludeElements: ["a"],
    particles: [
      {
        shape: "circle",
        move: "emit",
        easing: "easeOutExpo",
        colors: [
          "rgba(255,182,185,.9)",
          "rgba(250,227,217,.9)",
          "rgba(187,222,214,.9)",
          "rgba(138,198,209,.9)",
        ],
        number: 30,
        duration: [1200, 1800],
        shapeOptions: {
          radius: [16, 32],
        },
      },
    ],
  });
</script>
```

## Options

```ts
type Move = "emit" | "diffuse" | "rotate";
type MoveOptions = EmitOptions | DiffuseOptions | RotateOptions;

interface FireworkOptions {
  excludeElements: string[];
  particles: {
    shape: "circle" | "star" | "polygon";
    move: Move | Move[];
    easing?: EasingTypes;
    colors: string[];
    number: number | [number, number];
    duration: number | [number, number];
    shapeOptions: CircleOptions | StarOptions | PolygonOptions;
    moveOptions?: MoveOptions | MoveOptions[];
  }[];
}

type CircleOptions = {
  radius: number | [number, number];
  alpha?: number | [number, number];
  lineWidth: number | [number, number];
};

type StarOptions = CircleOptions & {
  spikes: number | [number, number];
};

type PolygonOptions = CircleOptions & {
  sides: number | [number, number];
};

type EmitOptions = {
  emitRadius?: number | [number, number]; // default [50, 180]
  radius?: number | [number, number]; // default 0.1
  alphaChange?: boolean; // default false
  alpha?: number | [number, number]; // default 0
  alphaEasing?: EasingTypes; // default linear
  alphaDuration?: number | [number, number]; // default [600, 800]
};

type DiffuseOptions = {
  diffuseRadius?: number | [number, number]; // default [80, 160]
  lineWidth?: number | [number, number]; // for ring, default 0
  alpha?: number | [number, number]; // default 0
  alphaEasing?: EasingTypes; // default linear
  alphaDuration?: number | [number, number]; // default [600, 800]
};

type RotateOptions = {
  angle?: number | [number, number]; // default [-180, 180]
};
```

### excludeElements(`string[]`)

Fireworks are not triggered when these elements are clicked

It is recommended to exclude animations on elements like `a` and `buttons` tags

### particles(`Object`)

Specific options of firework particles

#### shape(`"circle" | "star" | "polygon"`)

Shape of the particles

#### move(`Move | Move[]`)

The way the particles move, `emit` indicates random movement from the center in all directions, `diffuse` indicates getting bigger and fading from the center, `rotate` indicates rotating around the center

#### easing(`EasingTypes`, default = `"linear"`)

see [types](https://github.com/theme-shoka-x/theme-shokax-anime/blob/main/src/types.ts) for more information.

#### colors(`string[]`)

Color pool, particles will be randomly selected from these colors, supports rgba and hexadecimal.

e.g.

```js
colors: [
  "rgba(255,182,185,.9)",
  "rgba(250,227,217,.9)",
  "rgba(187,222,214,.9)",
  "rgba(138,198,209,.9)",
];
colors: ["#fff", "#000"];
```

#### number(`number | [number, number]`)

Number of particles, support interval

#### duration(`number | [number, number]`)

Duration of the motion of the particle, support interval

#### shapeOptions(`CircleOptions | StarOptions | PolygonOptions`)

##### CircleOptions

Initial properties of a circle

###### radius(`number | [number, number]`)

Initial radius of the circle, support interval

###### alpha(`number | [number, number]`, default = `1`)

Initial alpha of the circle, support interval

###### lineWidth(`number | [number, number]`)

If set, the shape changes to hollow

Initial lineWidth of the circle, support interval

##### StarOptions

###### spikes(`number | [number, number]`)

Number of star spikes, support interval

##### PolygonOptions

###### sides(`number | [number, number]`)

Number of polygon sides, support interval

#### moveOptions(`MoveOptions | MoveOptions[]`, optional)

##### EmitOptions

###### emitRadius(`number | [number, number]`, default = `[50, 180]`)

Emission radius, default 50-180px

###### radius(`number | [number, number]`, default = `0.1`)

The final radius of the particle, default 0.1px

###### alphaChange(`boolean`, default = `false`)

If or not the alpha is changed when emitting, default false.

###### alpha(`number | [number, number]`, default = `0`)

The final alpha at the end of the emission, default 0

###### alphaEasing(`EasingTypes`, default = `"linear"`)

Easing function of the alpha, default linear, see [types](https://github.com/theme-shoka-x/theme-shokax-anime/blob/main/src/types.ts) for more information.

###### alphaDuration(`number | [number, number]`, default = `[600, 800]`)

Duration of alpha changes during emission, default 600-800ms

##### DiffuseOptions

###### diffuseRadius(`number | [number, number]`, default = `[80, 160]`)

Diffusion radius, default 80-160px

###### lineWidth(`number | [number, number]`, default = `0`, only for ring)

The final lineWidth of the ring, default 0px

###### alpha(`number | [number, number]`, default = `0`)

The final alpha at the end of the diffusion, default 0

###### alphaEasing(`EasingTypes`, default = `"linear"`)

Easing function of the alpha, default linear, see [types](https://github.com/theme-shoka-x/theme-shokax-anime/blob/main/src/types.ts) for more information.

###### alphaDuration(`number | [number, number]`, default = `[600, 800]`)

Duration of alpha changes during diffusion, default 600-800ms

##### RotateOptions

###### angle(`number | [number, number]`, default = `[-180, 180]`)

Angle of rotation in degrees, default -180-180deg
