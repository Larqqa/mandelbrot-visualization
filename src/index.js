import './main.scss';
import { getById, fetchWasm, findMandelbrot } from './util';

async function main() {
  const wasm = await fetchWasm('./wasm/mandelbrot_bg.wasm');

  const size = 400;
  const cv = getById('rCanvas');
  const ctx = cv.getContext('2d');
  cv.width = size;
  cv.height = size;

  let xOff = 0;
  let yOff = 0;
  let minRange = 2;
  let maxRange = 2;
  let iter = 100;

  let wasmMath = true;

  document.addEventListener('keypress', (e) => {
    if (e.code === 'KeyD') xOff -= 10;
    if (e.code === 'KeyA') xOff += 10;

    if (e.code === 'KeyW') yOff -= 10;
    if (e.code === 'KeyS') yOff += 10;

    if (e.code === 'KeyZ') minRange *= .9;
    if (e.code === 'KeyX') minRange *= 1.1;
    if (e.code === 'KeyC') maxRange *= .9;
    if (e.code === 'KeyV') maxRange *= 1.1;

    if (e.code === 'KeyE') iter += 1;
    if (e.code === 'KeyR') iter -= 1;
  });

  const button = getById('toggler');
  button.addEventListener('click', () => wasmMath = !wasmMath);

  const fpsUi = getById('fps').querySelector('span');
  const calcUi = getById('calc').querySelector('span');
  const xUi = getById('x').querySelector('span');
  const yUi = getById('y').querySelector('span');
  const minUi = getById('min').querySelector('span');
  const maxUi = getById('max').querySelector('span');
  const iterUi = getById('iter').querySelector('span');


  let n = 0;

  let lastCalled = performance.now();
  let fps = 0;
  let delta = 0;

  setInterval(() => {
    fpsUi.innerHTML = fps;
    calcUi.innerHTML = wasmMath === true ? 'wasm' : 'js';
    xUi.innerHTML = xOff;
    yUi.innerHTML = yOff;
    minUi.innerHTML = minRange;
    maxUi.innerHTML = maxRange;
    iterUi.innerHTML = iter;

    if (wasmMath) {
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          n = wasm.find_mandelbrot(x, y, xOff, yOff, size, size, minRange, maxRange, iter);
          ctx.fillStyle = `rgba(${n}, ${n}, ${n}, ${255})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    } else {
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          n = findMandelbrot(x, y, xOff, yOff, size, size, minRange, maxRange, iter);
          ctx.fillStyle = `rgba(${n}, ${n}, ${n}, ${255})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    delta = (performance.now() - lastCalled) / 1000;
    lastCalled = performance.now();
    fps = Math.floor(1 / delta);
  }, 10);
}
main();
