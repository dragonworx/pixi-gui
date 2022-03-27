import Parser from '../parser/parser';
import Element from '../lib/node/element';
import { queryParam } from '../lib/util';
import Row from '../lib/layout/row';
import Column from '../lib/layout/column';
import { enableLog } from '../lib/log';

// enableLog();

// @ts-ignore
import xml from './genisis.xml';
import { dump } from '../lib/log';

const doc = Parser.fromXmlString(xml);
const win = window as any;

const blue = doc.getNodeById<Element>('blue');
win.blue = blue;

const colors = ['red', 'green', 'pink', 'yellow', 'grey', 'lime', 'salmon'];
const randSize = () => Math.ceil(Math.random() * 4) * 10;

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

doc.init();

console.log(doc);
win.doc = doc;
win.row = row;

dump();
