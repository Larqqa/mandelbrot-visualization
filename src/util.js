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
export function generateMandelbrot(width, height, offsetX, offsetY, minRange, maxRange, iterations) {
  let x, y, a, b, termOne, termTwo, oldA, oldB, n, alpha;
  const pixels = new Float32Array(width * height);

  for (x = 0; x < width; x++) {
    for (y = 0; y < height; y++) {
      a = mapValue(x - offsetX, 0, width, -minRange, maxRange);
      b = mapValue(y - offsetY, 0, height, -minRange, maxRange);

      oldA = a;
      oldB = b;

      n = 0;
      while (n < iterations) {
        termOne = a * a - b * b;
        termTwo = 2 * (a * b);

        a = termOne + oldA;
        b = termTwo + oldB;

        if (a * a + b * b > iterations) break;

        n++;
      }

      // Map iteration amount to a color value between 0 and 255
      // alpha = n === iterations ? 0 : mapValue(Math.sqrt(mapValue(n, 0, iterations, 0, 1)), 0, 1, 0, 255);
      alpha = n === iterations ? 0 : mapValue(n, 0, iterations, 0, 255);
      pixels[y * width + x] = alpha;
    }
  }

  return pixels;
}

export function generateMandelbrotDoubleArray(width, height, offsetX, offsetY, minRange, maxRange, iterations) {
  let x, y, a, b, termOne, termTwo, oldA, oldB, n, alpha;
  const pixels = [];
  let row = [];
  for (x = 0; x < width; x++) {
    row = [];

    for (y = 0; y < height; y++) {
      a = mapValue(x - offsetX, 0, width, -minRange, maxRange);
      b = mapValue(y - offsetY, 0, height, -minRange, maxRange);

      oldA = a;
      oldB = b;

      n = 0;
      while (n < iterations) {
        termOne = a * a - b * b;
        termTwo = 2 * (a * b);

        a = termOne + oldA;
        b = termTwo + oldB;

        if (a * a + b * b > iterations) break;

        n++;
      }

      // Map iteration amount to a color value between 0 and 255
      // alpha = n === iterations ? 0 : mapValue(Math.sqrt(mapValue(n, 0, iterations, 0, 1)), 0, 1, 0, 255);
      alpha = n === iterations ? 0 : mapValue(n, 0, iterations, 0, 255);
      row.push(alpha);
    }

    pixels.push(row);
  }

  return pixels;
}
