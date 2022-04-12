import { Application } from 'pixi.js';
import DOM from 'src/lib/core/document';
import Element from 'src/lib/core/element';

const main = document.getElementById('main')!;

const app = new Application({
  width: 500,
  height: 500,
  backgroundColor: 0x333333,
});

main.appendChild(app.renderer.view);

const dom = new DOM(app);

const blue = new Element({
  width: 150,
  backgroundColor: 0x0000ff,
});
blue.width = 200;
blue.height = 300;
dom.root.addChild(blue);

(window as any).blue = blue;
(window as any).dom = dom;
