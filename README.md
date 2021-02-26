# Mandelbrot set visualization in WebGL
[Demo website](https://larqqa.github.io/mandelbrot-visualization/)

## What is this?
This is my interpretation of a Mandelbrot set visualization.
I used WebGL to plot the Set. The App itself can visualize the Mandelbrot set and the Julia set in a HSV colour scheme.

## How to use?

`npm install` to install the necessary packages

`npm start` to start the workflow, use

`npm run build` makes a production build of the project

`npm run serve` serves the production folder located in `dist`

`npm run lint`  to lint your JavaScript

## What is the Mandelbrot set?

The mandelbrot set is a set of complex numbers `c` for which the function `f(z) = z2 + c` does not diverge, when iterated from `z = 0`, or in laymans terms: `c` doesn't go infinite.

The formula for the iterations is as follows:
```
f(0) = 0
f(1) = 0² + c
f(2) = c² + c
f(3) = c² + c² + c
...
```

The more you iterate the function, the more accurate the calculations get.

`c` is the complex number `a + bi`

We can simplify the expression `c²`:
```
c² = (a + bi)(a + bi)
c² = a² + abi + abi + b²
c² = a² + 2abi - b2
c² = a² - b² + 2abi
```

So when calculating the Mandelbrot set, we can calculate the separate expressions to represent `a` and `bi`
```
a = (a² - b²) + a
bi = 2abi + bi
```

`a` and `bi` can be mapped to the coordinate system as `x` an `y`, which allows us to easily represent the set in a 2D grid of pixels.

As the Mandelbrot set is roughly situated between `-1...0...1 x` and `-2...0...1 y`, we can calculate if it is going to infinity with `a² + b² > 4.0`


For a more formal definition, check out the [Wikipedia page](https://en.wikipedia.org/wiki/Mandelbrot_set)
