export const vsSource = `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
`;

export const fsSource = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  uniform vec2 uViewPort;
  uniform vec2 uPosOff;
  uniform vec2 uABOff;
  uniform float uScale;
  uniform float uXScale;
  uniform bool uIsJulia;
  uniform vec3 uHSV;
  uniform bool uSmoothing;
  uniform bool uBlackAndWhite;
  uniform bool uInvert;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 0.66666, 0.33333, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    float x = (gl_FragCoord.x - uPosOff.x) * (uXScale - (-uXScale)) / uViewPort.x + (-uXScale);
    float y = (gl_FragCoord.y - uPosOff.y) * (uScale - (-uScale)) / uViewPort.y + (-uScale);
    float xO = uIsJulia == true ? uABOff.x : x;
    float yO = uIsJulia == true ? uABOff.y : y;

    float temp = 0.0;
    float n = 0.0;
    float z = 0.0;
    float h = 0.0;
    float s = 0.0;
    float v = 0.0;
    vec3 clr;

    const float iter = [ITERATIONS]; // This is set in shader.js

    for (float i = 0.0; i < iter; i++) {
      temp = x * x - y * y;
      y = 2.0 * (x * y) + yO;
      x = temp + xO;
      z = x * x + y * y;
      if (z > 8.0) break;
      n++;
    }

    if (uSmoothing == true) {
      n = n == iter ? 0.0 : (n + 1.0 - ( log( log( abs( sqrt(z) ) ) ) / log(2.0) ) ) / 50.0;
    } else {
      n = n == iter ? 0.0 : n * 1.0 / iter;
    }

    h = uHSV.x >= 0.0 ? uHSV.x : n;
    s = uHSV.y >= 0.0 ? uHSV.y : n;
    v = uHSV.z >= 0.0 ? uHSV.z : n;

    clr = hsv2rgb(vec3(h, s, v));

    if (uHSV.x > -1.0 && uHSV.y > -1.0 && uHSV.z > -1.0) {
      clr = hsv2rgb(vec3(h / n, s / n, v / n));
    }

    if (uBlackAndWhite == true) {
      clr = vec3(n,n,n);
    }

    if (uInvert == true) {
      clr = vec3(1.0, 1.0, 1.0) - clr;
    }

    gl_FragColor = vec4(clr, 1.0);
  }
`;