export class Program {
  constructor(canvas, shader) {
    this.canvas = canvas;
    this.gl = canvas.gl;

    this.xOffset = 0;
    this.yOffset = 0;
    this.scale = 2;

    this.aOffset = 0;
    this.bOffset = 0;
    this.isJulia = false;

    this.shader = shader;
    this.shaderProgram = shader.shaderProgram;

    this.buffers = this.initBuffers();
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
        vertexColor:    this.gl.getAttribLocation(this.shaderProgram, 'aVertexColor'),
      },
      uniformLocations: {
        viewPort: this.gl.getUniformLocation(this.shaderProgram, 'uViewPort'),
        xOffset:  this.gl.getUniformLocation(this.shaderProgram, 'uXOff'),
        yOffset:  this.gl.getUniformLocation(this.shaderProgram, 'uYOff'),
        scale:    this.gl.getUniformLocation(this.shaderProgram, 'uScale'),
        isJulia:  this.gl.getUniformLocation(this.shaderProgram, 'uIsJulia'),
        aOffset:  this.gl.getUniformLocation(this.shaderProgram, 'uA'),
        bOffset:  this.gl.getUniformLocation(this.shaderProgram, 'uB'),
      },
    };
  }

  initBuffers() {
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

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
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers);

    this.gl.vertexAttribPointer(this.programInfo.attribLocations.vertexPosition, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);

    this.gl.useProgram(this.programInfo.program);

    this.gl.uniform2fv(this.programInfo.uniformLocations.viewPort, [ this.canvas.width, this.canvas.height ]);

    this.gl.uniform1f(this.programInfo.uniformLocations.xOffset, this.xOffset);
    this.gl.uniform1f(this.programInfo.uniformLocations.yOffset, this.yOffset);
    this.gl.uniform1f(this.programInfo.uniformLocations.scale, this.scale);

    this.gl.uniform1f(this.programInfo.uniformLocations.isJulia, this.isJulia);
    this.gl.uniform1f(this.programInfo.uniformLocations.aOffset, this.aOffset);
    this.gl.uniform1f(this.programInfo.uniformLocations.bOffset, this.bOffset);
    // this.gl.enable(this.gl.BLEND);
    // this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
  }
}