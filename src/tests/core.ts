import { Application } from 'pixi.js';
import DOM from 'src/lib/core/document';
import FillColor from 'src/lib/core/fillColor';

const main = document.getElementById('main')!;

const app = new Application({
  width: 500,
  height: 500,
  backgroundColor: 0x333333,
});

main.appendChild(app.renderer.view);

const dom = new DOM(app);

const blue = new FillColor();
blue.color = 0x0000ff;
dom.root.addChild(blue);
blue.width = 100;
blue.height = 100;

(window as any).dom = dom;
