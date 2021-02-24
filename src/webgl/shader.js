import { vsSource, fsSource } from './shader_source.js';

export class Shader {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.gl;
    this.iterations = 100;
    this.oscillation = true;

    this.vsSource = vsSource;
    this.vertexShader = this.loadShader(this.gl.VERTEX_SHADER, this.vsSource);

    // To control the value of iterations, we have to hard code the constant replacement
    // to the shader.
    // Also cause JS, janky int to float conversion.
    this.fsSource = fsSource.replace('[ITERATIONS]', this.iterations + '.0');
    this.fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, this.fsSource);

    this.shaderProgram = this.buildShaderProgram();
  }

  updateIterations() {
    // Here we reload and rebuild the shader program, with the updated iteration amount.
    this.fsSource = fsSource.replace('[ITERATIONS]', Math.floor(this.iterations) + '.0');
    this.fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, this.fsSource);
    this.shaderProgram = this.buildShaderProgram();
  }

  buildShaderProgram() {
    const shaderProgram = this.gl.createProgram();
    this.gl.attachShader(shaderProgram, this.vertexShader);
    this.gl.attachShader(shaderProgram, this.fragmentShader);
    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    return shaderProgram;
  }

  loadShader(type, source) {
    const shader = this.gl.createShader(type);

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }
}