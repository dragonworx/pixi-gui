import { Application } from 'pixi.js';
import DOM from 'src/lib/core/document';
import Element from 'src/lib/core/element';
import Grid from 'src/lib/display/grid';
import { ALIGN_CENTER, JUSTIFY_CENTER } from 'yoga-layout-prebuilt';

const main = document.getElementById('main')!;

const app = new Application({
  width: 400,
  height: 400,
  backgroundColor: 0,
});

main.appendChild(app.renderer.view);

const doc = new DOM(app);

const grid = Grid.createTilingSprite(1000, 1000);
doc.stage.addChildAt(grid, 0);

const blue = new Element({
  id: 'blue',
  backgroundColor: 0x0000ff,
  x: 50,
});
blue.width = 200;
blue.height = 200;
doc.root.addChild(blue);

const green = new Element({
  id: 'green',
  width: 50,
  height: 50,
  backgroundColor: 0x00ff00,
});
blue.addChild(green);

(window as any).doc = doc;
(window as any).blue = blue;
(window as any).green = green;
