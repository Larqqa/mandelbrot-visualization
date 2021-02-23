export class Shader {
  constructor(canvas) {
    this.vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec4 aVertexColor;

      varying lowp vec4 vColor;

      void main() {
        gl_Position = aVertexPosition;
        gl_PointSize = 10.0;

        vColor = aVertexColor;
      }
    `;

    this.fsSource = `
      precision mediump float;
      uniform vec2 uViewPort;

      void main() {
        float vX = uViewPort.x;
        float vY = uViewPort.y;

        float x = gl_FragCoord.x * 2.5 / vX - 2.0;
        float y = gl_FragCoord.y * 2.5 / vY - 1.2;

        float xO = x;
        float yO = y;

        float temp = 0.0;

        float n = 0.0;
        for(int i = 0; i < 1000; i++){
          temp = x*x - y*y + xO;
          y = 2.0 * (x * y) + yO;
          x = temp;

          if (x * x + y * y > 4.0) break;

          n++;
        }

        if (n == 1000.0) {
          n = 0.0;
        } else {
          n = n * 1.0 / 1000.0;
        }

        gl_FragColor = vec4(n, n, n, 1.0);
      }
    `;

    this.canvas = canvas;
    this.gl = canvas.gl;

    this.vertexShader = this.loadShader(this.gl.VERTEX_SHADER, this.vsSource);
    this.fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, this.fsSource);

    this.buildShaderProgram();
    this.generateProgramInfo();
  }

  buildShaderProgram() {

    // Create the shader program
    this.shaderProgram = this.gl.createProgram();
    this.gl.attachShader(this.shaderProgram, this.vertexShader);
    this.gl.attachShader(this.shaderProgram, this.fragmentShader);
    this.gl.linkProgram(this.shaderProgram);

    // If creating the shader program failed, alert
    if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(this.shaderProgram));
      return null;
    }

    this.shaderProgram;
  }

  generateProgramInfo() {
    this.programInfo = {
      program: this.shaderProgram,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
        vertexColor: this.gl.getAttribLocation(this.shaderProgram, 'aVertexColor'),
      },
      uniformLocations: {
        projectionMatrix: this.gl.getUniformLocation(this.shaderProgram, 'uViewPort'),
      },
    };
  }

  loadShader(type, source) {
    const shader = this.gl.createShader(type);

    // Send the source to the shader object
    this.gl.shaderSource(shader, source);

    // Compile the shader program
    this.gl.compileShader(shader);

    // See if it compiled successfully
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }
}