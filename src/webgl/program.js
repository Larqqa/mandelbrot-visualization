export class Program {
  constructor(canvas, shader) {
    this.canvas = canvas;
    this.gl = canvas.gl;

    this.shader = shader;
    this.shaderProgram = shader.shaderProgram;

    this.xOffset = 0;
    this.yOffset = 0;
    this.scale = 2;

    this.aOffset = 0;
    this.bOffset = 0;
    this.isJulia = false;

    this.h = -1.0;
    this.s = -1.0;
    this.v = -1.0;

    this.smoothing = false;
    this.blackAndWhite = false;
    this.invert = false;

    this.buffer = this.initBuffer();
    this.programInfo = this.generateProgramInfo();
  }

  reloadShaders() {
    this.shaderProgram = this.shader.shaderProgram;
    this.programInfo = this.generateProgramInfo();
  }

  generateProgramInfo() {
    return {
      program: this.shaderProgram,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
      },
      uniformLocations: {
        viewPort:      this.gl.getUniformLocation(this.shaderProgram, 'uViewPort'),
        posOffset:     this.gl.getUniformLocation(this.shaderProgram, 'uPosOff'),
        scale:         this.gl.getUniformLocation(this.shaderProgram, 'uScale'),
        xScale:        this.gl.getUniformLocation(this.shaderProgram, 'uXScale'),
        isJulia:       this.gl.getUniformLocation(this.shaderProgram, 'uIsJulia'),
        abOffset:      this.gl.getUniformLocation(this.shaderProgram, 'uABOff'),
        hsv:           this.gl.getUniformLocation(this.shaderProgram, 'uHSV'),
        smoothing:     this.gl.getUniformLocation(this.shaderProgram, 'uSmoothing'),
        blackAndWhite: this.gl.getUniformLocation(this.shaderProgram, 'uBlackAndWhite'),
        invert:        this.gl.getUniformLocation(this.shaderProgram, 'uInvert'),
      },
    };
  }

  initBuffer() {
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

    // Setup a rect to the viewports corners
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0,  1.0,
        1.0,  1.0,
        1.0, -1.0,
        -1.0, -1.0
      ]),
      this.gl.STATIC_DRAW
    );

    return positionBuffer;
  }

  drawScene() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

    this.gl.vertexAttribPointer(
      this.programInfo.attribLocations.vertexPosition,
      2, this.gl.FLOAT, false, 0, 0);

    this.gl.enableVertexAttribArray(
      this.programInfo.attribLocations.vertexPosition);

    this.gl.useProgram(this.programInfo.program);

    this.gl.uniform2fv(
      this.programInfo.uniformLocations.viewPort,
      [ this.canvas.width, this.canvas.height ]);

    this.gl.uniform2fv(
      this.programInfo.uniformLocations.posOffset,
      [ this.xOffset / this.scale, this.yOffset / this.scale ]);

    this.gl.uniform2fv(
      this.programInfo.uniformLocations.abOffset,
      [ this.aOffset, this.bOffset ]);

    this.gl.uniform3fv(
      this.programInfo.uniformLocations.hsv,
      [ this.h, this.s, this.v ]
    );

    this.gl.uniform1f(this.programInfo.uniformLocations.xScale, this.scale * (this.canvas.width / this.canvas.height));
    this.gl.uniform1f(this.programInfo.uniformLocations.scale, this.scale);
    this.gl.uniform1f(this.programInfo.uniformLocations.isJulia, this.isJulia);
    this.gl.uniform1f(this.programInfo.uniformLocations.smoothing, this.smoothing);
    this.gl.uniform1f(this.programInfo.uniformLocations.blackAndWhite, this.blackAndWhite);
    this.gl.uniform1f(this.programInfo.uniformLocations.invert, this.invert);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
  }
}