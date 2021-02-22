export function getById(id) {
  return document.getElementById(id);
}

export async function fetchWasm(wasm) {
  try {
    const req = await fetch(wasm);
    const res = await req.arrayBuffer();
    const results = await WebAssembly.instantiate(res);

    return results.instance.exports;
  } catch(e) {
    throw new Error(e);
  }
}

export function mapValue(value, in_min, in_max, out_min, out_max) {
  return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

/**
* The mandelbrot set is a set of complex numbers c for which the function f(z) = z2 + c
* does not diverge, when iterated from z=0, in laymans terms: c doesn't go infinite.
*
* f(0) = 0
* f(1) = 0² + c
* f(2) = c² + c
* f(3) = c² + c² + c
* ...
*
* c = a + bi, where a and b are from the coordinate system and i is an imaginary number
* c² = (a + bi)(a + bi)
*    = a² + 2abi - b2
*    = a² - b² + 2abi
*
* and i = √-1
*
* c² + c = (a² - b² + 2abi) + a + bi
*
*/
export function generateMandelbrot(buffer, width, height, offsetX, offsetY, range, iterations, widthRatio, heightRatio, paramA = false, paramB = false) {
  let pos, x, y, a, b, termOne, oldA, oldB, n;

  const offX = (offsetX) / range;
  const offY = offsetY / range;

  const xRange = range * widthRatio;
  const yRange = range * heightRatio;

  for (x = 0; x < width; x++) {
    oldA = mapValue(x - offX, 0, width, -xRange, xRange);
    for (y = 0; y < height; y++) {
      a = oldA;
      b = mapValue(y - offY, 0, height, -yRange, yRange);
      oldB = b;

      n = 0;
      while (n < iterations) {
        termOne = a * a - b * b + (paramA ? paramA : oldA);
        b = 2 * (a * b) + (paramB ? paramB : oldB);
        a = termOne;

        if (a * a + b * b > 4) break;

        n++;
      }

      n = n === iterations ? 0 : mapValue(n, 0, iterations, 0, 765);
      pos = (y * width + x) * 4;
      buffer[pos + 0] = n > 255 ? 255 : n;
      buffer[pos + 1] = n > 255 ? n - 255 : 0;
      buffer[pos + 2] = n > 510 ? n - 510 : 0;
      buffer[pos + 3] = mapValue(n, 0, 765, 255, 0);
    }
  }

  return buffer;
}