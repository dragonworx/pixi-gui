import React, { FormEvent, useEffect, useRef, useState } from 'react';
import Grid from 'src/lib/display/grid';
import Document from 'src/lib/node/document';
import Parser from 'src/parser/parser';
import { query } from './util';

const grid = Grid.createTilingSprite(5000, 5000);

type Example = {
  label: string;
  file: string;
};

const examples: Example[] = [
  { label: 'Test1', file: 'test1' },
  { label: 'Test2', file: 'test2' },
];

const getExamplePageUrl = (example: string) =>
  `${location.protocol}//${location.host}/?example=${example}`;

const getExampleXmlUrl = (example: string) =>
  `${location.protocol}//${location.host}/examples/${example}.xml`;

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef) {
      if (!query.example) {
        location.href = getExamplePageUrl(examples[0].file);
      } else {
        const url = getExampleXmlUrl(query.example);
        console.log('Loading example:', url);
        fetch(url).then(response => {
          if (response.status >= 400) {
            alert(`Example ${url} not found.`);
            return;
          }

          response.text().then(xml => {
            const container = containerRef.current!;
            const doc = Parser.fromXmlString(xml, {
              container: container,
              resizeTo: container,
              deferInit: true,
            });
            doc.stage.addChildAt(grid, 0);
            doc.init();
          });
        });
      }
    }
  }, [containerRef]);

  const onInput = (e: FormEvent<HTMLSelectElement>) => {
    if (e.currentTarget) {
      const example = e.currentTarget.value;
      window.location.href = getExamplePageUrl(example);
    }
  };

  const onReloadClick = () => window.location.reload();

  return (
    <div id="examples">
      <header>
        <select onInput={onInput} defaultValue={query.example}>
          {examples.map(example => (
            <option key={example.file} value={example.file}>
              {example.label}
            </option>
          ))}
        </select>
        <button onClick={onReloadClick}>Reload</button>
      </header>
      <div id="example" ref={containerRef}></div>
    </div>
  );
}
