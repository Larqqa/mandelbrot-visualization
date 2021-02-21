import './main.scss';
import { getById, fetchWasm, generateMandelbrot } from './util';
const wasm = import('./wasm/mandelbrot');
const canvas = document.getElementById('rCanvas');
const gl = canvas.getContext("2d");

wasm.then(m => {
  if (!gl) {
    alert('Failed to initialize canvas');
    return;
  }

  const size = 100;
  canvas.width = size;
  canvas.height = size;

  const cli = new m.Client(size, size);
  console.log("WASM");
  console.time();
  cli.render();
  console.timeEnd();
});

const cv = getById('canvas2');
const ctx = cv.getContext('2d');
const size = 100;
const width = size;
const height = size;
cv.width = width;
cv.height = height;
let x = 0;
let y = 0;
let minRange = 2;
let maxRange = 2;
let iter = 100;

console.log("JS");
console.time();
const pixels = generateMandelbrot(width, height, x, y, minRange, maxRange, iter);
for (let i = 0; i < pixels.length; i++) {
  const x = i % width;
  const y = Math.floor(i / width);
  const color = pixels[i];
  ctx.fillStyle = `rgba(${color}, ${color}, ${color}, ${255})`;
  ctx.fillRect(x, y, 1, 1);
}
console.timeEnd();












/*
const size = 100;

const cv = getById('canvas2');
const ctx = cv.getContext('2d');
const width = size;
const height = size;
cv.width = width;
cv.height = height;

let x = 0;
let y = 0;
let minRange = 3;
let maxRange = 3;
let iter = 50;

document.addEventListener('keypress', (e) => {
  if (e.code === 'KeyD') x -= 10;
  if (e.code === 'KeyA') x += 10;

  if (e.code === 'KeyW') y -= 10;
  if (e.code === 'KeyS') y += 10;

  if (e.code === 'KeyZ') minRange *= .9;
  if (e.code === 'KeyX') minRange *= 1.1;
  if (e.code === 'KeyC') maxRange *= .9;
  if (e.code === 'KeyV') maxRange *= 1.1;

  if (e.code === 'KeyE') iter += 1;
  if (e.code === 'KeyR') iter -= 1;
});

const xUi = getById('x').querySelector('span');
const yUi = getById('y').querySelector('span');
const minUi = getById('min').querySelector('span');
const maxUi = getById('max').querySelector('span');
const iterUi = getById('iter').querySelector('span');

setInterval(()=>{
  console.time();

  const pixels = generateMandelbrot(width, height, x, y, minRange, maxRange, iter);
  pixels.forEach((x, xi) => {
    x.forEach((y, yi) => {
      ctx.fillStyle = `rgba(${y}, ${y}, ${y}, ${255})`;
      ctx.fillRect(xi, yi, 1, 1);
    });

  });

  console.timeEnd();

  xUi.innerHTML = x;
  yUi.innerHTML = y;
  minUi.innerHTML = minRange;
  maxUi.innerHTML = maxRange;
  iterUi.innerHTML = iter;
}, 1000 / 60);
*/

