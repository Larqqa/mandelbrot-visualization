import './main.scss';
import { getById, fetchWasm, generateMandelbrot } from './util';
// const wasm = import('./wasm/mandelbrot');

// Setup canvas size
let width = window.innerWidth;
let height = window.innerHeight;
let widthRatio = width / height;
let heightRatio = height / width;

// Get and initialize the canvas
const cv = getById('rCanvas');
const ctx = cv.getContext('2d');
cv.width = width;
cv.height = height;
let buffer = new Uint8ClampedArray(width * height * 4);
let idata = ctx.createImageData(width, height);

// Update canvas when resizing the window
window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  widthRatio = width / height;
  heightRatio = height / width;
  cv.width = width;
  cv.height = height;
  buffer = new Uint8ClampedArray(width * height * 4);
  idata = ctx.createImageData(width, height);
});

// Get UI elements
const uiWrapper = getById('ui-wrapper');
const hamburger = getById('hamburger');

const xUi = getById('x');
const yUi = getById('y');
const scaleUi = getById('scale');
const iterUi = getById('iter');
const zUi = getById('zVal');
const cUi = getById('cVal');

// Initial fractal values
let xOff = 0;
let yOff = 0;
let scale = 3;
let iter = 100;
let z = 0;
let c = 0;

xUi.value = xOff;
yUi.value = yOff;
scaleUi.value = scale;
iterUi.value = iter;
zUi.value = z;
cUi.value = c;


let bufferImage;
let calcTime = 0;
let renderTime = 0;

async function renderImage() {
  calcTime = performance.now();
  // For wasm
  // const was = await wasm;
  // bufferImage = await was.generate_mandelbrot(buffer, width, height, xOff, yOff, scale, iter, 1, heightRatio, z, c);
  bufferImage = generateMandelbrot(buffer, width, height, xOff, yOff, scale, iter, 1, heightRatio, z, c);
  calcTime = (performance.now() - calcTime);

  renderTime = performance.now();
  idata.data.set(bufferImage);
  ctx.putImageData(idata, 0, 0);
  renderTime = (performance.now() - renderTime);
}

// Setup performance
const fpsUi = getById('fps').querySelector('span');
const calcUi = getById('calc').querySelector('span');
const renderUi = getById('render').querySelector('span');

let lastCalled = performance.now();
let fps = 0;
let delta = 0;

// The render loop
function render() {
  fpsUi.innerHTML = fps;
  calcUi.innerHTML = Math.floor(calcTime);
  renderUi.innerHTML = Math.floor(renderTime);

  delta = (performance.now() - lastCalled) / 1000;
  lastCalled = performance.now();
  fps = Math.floor(1 / delta);

  renderImage();

  window.requestAnimationFrame(render);
}
render();

// Map keys to effects
document.addEventListener('keypress', (e) => {
  if (e.code === 'KeyD') {
    xOff -= 10 * scale;
    xUi.value = xOff;
  } else if (e.code === 'KeyA') {
    xOff += 10 * scale;
    xUi.value = xOff;
  }

  if (e.code === 'KeyW') {
    yOff -= 10 * scale;
    yUi.value = yOff;
  } else if (e.code === 'KeyS') {
    yOff += 10 * scale;
    yUi.value = yOff;
  }

  if (e.code === 'KeyZ') {
    scale *= .9;
    scaleUi.value = scale;
  } else if (e.code === 'KeyX') {
    scale *= 1.1;
    scaleUi.value = scale;
  }

  if (e.code === 'KeyE') {
    iter += 1;
    iterUi.value = iter;
  } else if (e.code === 'KeyR') {
    iter -= 1;
    iterUi.value = iter;
  }

  if (e.code === 'KeyC') {
    z *= .999;
    zUi.value = z;
  } else if (e.code === 'KeyV') {
    z *= 1.001;
    zUi.value = z;
  }

  if (e.code === 'KeyB') {
    c *= .999;
    cUi.value = c;
  } else if (e.code === 'KeyN') {
    c *= 1.001;
    cUi.value = c;
  }
});

// Map ui to effects
getById('ui').addEventListener('submit', (e) => {
  e.preventDefault();

  xOff = parseFloat(e.target.x.value);
  xUi.value = xOff;

  yOff = parseFloat(e.target.y.value);
  yUi.value = yOff;

  scale = parseFloat(e.target.scale.value);
  scaleUi.value = scale;

  iter = parseFloat(e.target.iter.value);
  iterUi.value = iter;

  z = parseFloat(e.target.zVal.value);
  zUi.value = z;

  c = parseFloat(e.target.cVal.value);
  cUi.value = c;

  console.log(e.target.iter.value, e.target.zVal.value, e.target.cVal.value);
});

hamburger.addEventListener('click', () => {
  console.log('yeee');
  uiWrapper.classList.toggle('active');
});