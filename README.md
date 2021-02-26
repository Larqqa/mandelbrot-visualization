# Mandelbrot set visualization in WebGL
[Demo website](https://larqqa.github.io/mandelbrot-visualization/)

This

To start the workflow, use `npm start`.

`npm run build` makes a production build of the project
`npm run serve` serves the production folder located in `dist`
`npm run lint`  to lint your JavaScript

## What is the Mandelbrot set?
The mandelbrot set is a set of complex numbers ![formula](https://render.githubusercontent.com/render/math?math=c) for which the function ![formula](https://render.githubusercontent.com/render/math?math=f(z)%20=%20z2%20%2B%20c) does not diverge, when iterated from ![formula](https://render.githubusercontent.com/render/math?math=z=0), or in laymans terms: ![formula](https://render.githubusercontent.com/render/math?math=c) doesn't go infinite.

The formula for the iterations is as follows:

![formula](https://render.githubusercontent.com/render/math?math=f(0)%20=%200)

![formula](https://render.githubusercontent.com/render/math?math=f(1)%20=%200^2%2B%20c)

![formula](https://render.githubusercontent.com/render/math?math=f(2)%20=%20c^2%20%2B%20c)

![formula](https://render.githubusercontent.com/render/math?math=f(3)%20=%20c^2%20%2B%20c^2%20%2B%20c)

![formula](https://render.githubusercontent.com/render/math?math=...)


The more you iterate the function, the more accurate the calculations get.

c is the complex number a + bi

We can simplify the expression c²:
c² = (a + bi)(a + bi)
c² = a² + abi + abi + b²
c² = a² + 2abi - b2
c² = a² - b² + 2abi

So when calculating the Mandelbrot set, we can calculate the separate expressions to represent a and bi
a = (a² - b²) + a
bi = 2abi + bi

a and bi can be mapped to the coordinate system as x an y, which allows us to easily represent the set in a 2D grid of pixels.

As the Mandelbrot set is situated between -2 and 2 x and -2 and 2 y, we can calculate if it is going to infinity with a² + b² > 4.0.


For a more formal definition, check out the [Wikipedia page](https://en.wikipedia.org/wiki/Mandelbrot_set)