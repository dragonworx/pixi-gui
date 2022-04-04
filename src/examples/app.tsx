import React, { FormEvent, useEffect, useRef, useState } from 'react';
import Grid from 'src/lib/display/grid';
import Document from '../lib/node/document';
import Test1 from './test1';
import Test2 from './test2';

type Example = (doc: Document) => void;

const examples: Record<string, Example> = {
  Test1: Test1,
  Test2: Test2,
};

const defaultExample = 'Test';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<Document>();

  useEffect(() => {
    const container = containerRef.current;
    if (container && !doc) {
      const document = new Document({
        container,
        width: 500,
        height: 500,
        resizeTo: container,
      });
      setDoc(document);
    }
  }, [containerRef]);

  const onInput = (e: FormEvent<HTMLSelectElement>) => {
    if (e.currentTarget && doc) {
      const selection = e.currentTarget.value;
      const example = examples[selection];
      console.log('Load example');
      doc.clear();
      const grid = Grid.createTilingSprite(5000, 5000);
      doc.stage.addChildAt(grid, 0);
      example(doc);
      doc.init();
    }
  };

  return (
    <div id="examples">
      <header>
        <select onInput={onInput}>
          <option>Test1</option>
          <option>Test2</option>
        </select>
      </header>
      <div id="example" ref={containerRef}></div>
    </div>
  );
}
