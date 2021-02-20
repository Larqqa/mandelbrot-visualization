import { getById, fetchWasm } from './util';

const cv = getById('canvas');
const ctx = cv.getContext('2d');

function fib(n){
  if (n === 0 || n === 1) return 1;
  return fib(n - 1) + fib(n - 2);
}

async function main() {

  // ctx.fillText(5 + 5, 10, 10);
  // ctx.fillText(5 - 5, 10, 20);
  // ctx.fillText(5 / 5, 10, 30);
  // ctx.fillText(5 * 5, 10, 40);

  ctx.fillText(fib(30), 10, 10);
}

console.time();
main();
console.timeEnd();

async function mainWasm() {
  const wasm = await fetchWasm('./wasm/mandelbrot_bg.wasm');

  // ctx.fillText(wasm.add(5, 5), 10, 60);
  // ctx.fillText(wasm.substract(5, 5), 10, 70);
  // ctx.fillText(wasm.divide(5, 5), 10, 80);
  // ctx.fillText(wasm.multiply(5, 5), 10, 90);

  ctx.fillText(wasm.fib(30), 10, 20);
}

console.time();
mainWasm();
console.timeEnd();
