# Mandelbrot set visualization with JS and WASM
### Comparing the speed of JS and WASM for faster calculations

To start the workflow, use `npm start`.
This starts the WebPack dev server, which compiles the rust files in `wasm/src` and JavaScript files in `src`

WebPack is setup to autocompile and refresh the browser when you save the rust or JS files.

`npm run build` makes a production build of the project, with everything needed for running the JS and WASM code.
`npm run serve` serves the production folder located in `dist`