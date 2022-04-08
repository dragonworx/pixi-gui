import Parser from '../parser/parser';
import Element from '../lib/node/element';
import Document from '../lib/node/document';
import { queryParam } from '../lib/util';
import Row from '../lib/layout/row';
import Column from '../lib/layout/column';
import Grid from '../lib/display/grid';
import CustomContainer from '../lib/node/customContainer';
import Font, { defaultFont } from '../lib/text/font';
import Text from '../lib/text/staticText';
import Paragraph from '../lib/text/paragraph';

// @ts-ignore
import xml from './genisis.xml';
import { dump } from '../lib/log';
import { Sprite, Texture } from 'pixi.js';

const main = document.getElementById('main')!;

const doc = new Document({
  container: main,
  resizeTo: main,
  deferInit: true,
});

Parser.fromXmlString(xml, doc);

const win = window as any;
doc.stage.alpha = 0.5;

const blue = doc.getNodeById<Element>('blue');
win.blue = blue;

const colors = ['red', 'green', 'pink', 'yellow', 'grey', 'lime', 'salmon'];
const randSize = () => Math.ceil(Math.random() * 4) * 10;

const grid = Grid.createTilingSprite(1000, 1000);
doc.stage.addChildAt(grid, 0);

const row = new Row();
row.id = 'row';

for (let j = 0; j < 4; j++) {
  const column = new Column();
  column.reverse = true;
  column.alignH = 'center';
  column.id = 'column' + j;

  for (let i = 0; i < queryParam('items', 8); i++) {
    const element = new Element();
    element.id = String(i + 1);
    element.width = randSize();
    element.height = randSize();
    element.x = i * 10;
    element.marginLeft = 10;
    element.marginRight = 20;
    element.marginTop = 10;
    element.marginBottom = 20;
    element.fillColor = colors[i % colors.length];
    element.setParent(column);
  }

  column.setParent(row);
}

row.setParent(blue);

const foo = doc.getNodeById('foo');

for (let i = 0; i < 10; i++) {
  const element = new Element();
  element.id = String(i + 1);
  element.width = randSize();
  element.height = randSize();
  element.marginLeft = 10;
  element.marginRight = 20;
  element.marginTop = 10;
  element.marginBottom = 20;
  element.fillColor = colors[i % colors.length];
  foo.addChild(element, false);
}

doc.preload(['img/button.png', 'img/test.png']).then(() => {
  doc.init();

  const texture = doc.getTexture('img/button.png');
  const sprite = Sprite.from(texture);
  sprite.width = 100;
  sprite.height = 100;
  const custom = new CustomContainer();
  custom.object = sprite;
  custom.fixtureLeft = 0.25;
  custom.fixtureRight = 0.75;
  custom.anchorY = 0.5;
  custom.fixtureTop = 0.3;
  blue.addChild(custom);

  const text = new Text();
  text.id = 'text';
  text.color = 'yellow';
  text.text = 'hello world!';
  text.fixture = 'center';
  blue.addChild(text);

  const paragraph = new Paragraph();
  paragraph.text = 'Hello world! How about this?!';
  paragraph.fixture = 'fill';
  foo.addChild(paragraph);
});

console.log(doc);
win.doc = doc;
win.row = row;

dump();
