import { Canvas } from './webgl/canvas.js';
import { Shader } from './webgl/shader.js';
import { Program } from './webgl/program.js';
import { Engine } from './webgl/engine.js';
import './main.scss';

function main() {
  const canvas = new Canvas(document.getElementById('webglCanvas'), window.innerWidth, window.innerHeight);
  const shader = new Shader(canvas);
  const program = new Program(canvas, shader.programInfo);
  const engine = new Engine(canvas, program);

  engine.start();
}

window.onload = main;