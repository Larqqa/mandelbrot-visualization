import { Canvas } from './webgl/canvas.js';
import { Shader } from './webgl/shader.js';
import { Program } from './webgl/program.js';
import { Controls } from './webgl/controls.js';
import { Engine } from './webgl/engine.js';
import { UI } from './webgl/userinterface.js';

import './main.scss';

function main() {
  const canvas = new Canvas(document.getElementById('webglCanvas'), window.innerWidth, window.innerHeight);
  const shader = new Shader(canvas);
  const program = new Program(canvas, shader);
  const engine = new Engine(canvas, program, shader);
  const ui = new UI(canvas, program, engine, shader);
  engine.ui = ui;
  const controls = new Controls(canvas, shader, program, ui);


  engine.start();
}

window.onload = main;