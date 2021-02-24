function getById(id) {
  return document.getElementById(id);
}

export class UI {
  constructor(canvas, program, engine, shader) {
    this.canvas = canvas;
    this.program = program;
    this.engine = engine;
    this.shader = shader;

    this.uiWrapper = getById('ui-wrapper');

    this.fps = getById('fps').querySelector('span');
    this.missed = getById('missed').querySelector('span');
    this.render = getById('render').querySelector('span');

    this.x = getById('x');
    this.y = getById('y');
    this.scale = getById('scale');
    this.iterations = getById('iterations');

    this.julia = getById('julia');
    this.a = getById('a');
    this.b = getById('b');

    this.UIform = getById('ui-form');
    this.UIform.addEventListener('submit', (e) => this.calculateUI(e));
    this.julia.addEventListener('click', () => this.program.isJulia = !this.program.isJulia);

    this.hamburger = getById('hamburger');
    this.hamburger.addEventListener('click', () => {
      this.uiWrapper.classList.toggle('active');
      this.hamburger.classList.toggle('active');
    });

    this.footer = getById('footer');

    this.updateUI();
  }

  updatePerf() {
    this.fps.innerHTML = this.engine.fps;
    this.missed.innerHTML = this.engine.missedFrameCount;
    this.render.innerHTML = this.engine.renderPerf + ' ms';
  }

  updateUI() {
    this.x.value = this.program.xOffset;
    this.y.value = this.program.yOffset;
    this.scale.value = this.program.scale;
    this.iterations.value = this.shader.iterations;
    this.a.value = this.program.aOffset;
    this.b.value = this.program.bOffset;
    this.julia.checked = this.program.isJulia;
  }

  calculateUI(e) {
    e.preventDefault();

    this.program.xOffset = parseFloat(e.target.x.value);
    this.program.yOffset = parseFloat(e.target.y.value);

    this.program.aOffset = parseFloat(e.target.a.value);
    this.program.bOffset = parseFloat(e.target.b.value);

    this.program.scale = parseFloat( e.target.scale.value);

    this.shader.iterations = e.target.iterations.value < 0 ? 0 : e.target.iterations.value;
    this.shader.updateIterations();
    this.program.reloadShaders();
  }
}