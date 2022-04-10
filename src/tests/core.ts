import { Application } from 'pixi.js';
import DOM from 'src/lib/core/dom';

const main = document.getElementById('main')!;

const app = new Application({
  width: 500,
  height: 500,
  backgroundColor: 0x333333,
});

main.appendChild(app.renderer.view);

const dom = new DOM(app);
