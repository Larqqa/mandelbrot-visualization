export class Canvas {
  constructor(canvas, width, height) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.xCenter = width / 2;
    this.yCenter = height / 2;

    this.gl = this.canvas.getContext("webgl");
    if (this.gl === null) {
      console.error("Unable to initialize WebGL. Your browser or machine may not support it.");
      return;
    }

    this.clear();
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    this.xCenter = width / 2;
    this.yCenter = height / 2;
    this.gl.viewport(0, 0, width, height);

    this.clear();
  }

  clear() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}