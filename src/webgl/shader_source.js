export const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;
  varying lowp vec4 vColor;
  void main() {
    gl_Position = aVertexPosition;
    gl_PointSize = 10.0;
    vColor = aVertexColor;
  }
`;

export const fsSource = `
  precision highp float;
  uniform vec2 uViewPort;
  uniform float uXOff;
  uniform float uYOff;
  uniform float uScale;
  uniform bool uIsJulia;
  uniform float uA;
  uniform float uB;

  void main() {
    float vX = uViewPort.x;
    float vY = uViewPort.y;

    float offX = uXOff / uScale;
    float offY = uYOff / uScale;

    float xScale = uScale * (vX / vY);

    float x = (gl_FragCoord.x - offX) * (xScale - (-xScale)) / vX + (-xScale);
    float y = (gl_FragCoord.y - offY) * (uScale - (-uScale)) / vY + (-uScale);
    float xO = uIsJulia == true ? uA : x;
    float yO = uIsJulia == true ? uB : y;

    float temp = 0.0;
    float n = 0.0;
    const float iter = [ITERATIONS];

    for (float i = 0.0; i < iter; i++) {
      temp = x * x - y * y;
      y = 2.0 * (x * y) + yO;
      x = temp + xO;
      if (x * x + y * y > 4.0) break;
      n++;
    }

    n = n == iter ? 0.0 : n * 1.0 / iter;
    gl_FragColor = vec4(0.0, n, n, 1.0 / n);
  }
`;