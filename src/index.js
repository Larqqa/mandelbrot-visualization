function getById(id) {
  return document.getElementById(id);
}

async function fetchWasm() {
  const req = await fetch('main.wasm');
  const res = await req.arrayBuffer();
  const results = await WebAssembly.instantiate(res);

  return results.instance.exports;
}

const cv = getById('canvas');
const ctx = cv.getContext('2d');

async function renderWasm(foo, bar) {
  const wasm = await fetchWasm();

  ctx.fillText(wasm.add(foo, bar), 10, 10);
  ctx.fillText(wasm.substract(foo, bar), 10, 20);
  ctx.fillText(wasm.multiply(foo, bar), 10, 30);
  ctx.fillText(wasm.divide(foo, bar), 10, 40);
  ctx.fillText(wasm.fib(10), 10, 50);
}
// renderWasm(7,7);

function main () {
  console.log('hello');
}

main();