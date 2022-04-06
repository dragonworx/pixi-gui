import React, { FormEvent, useEffect, useRef, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark as theme } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { SplitPane } from 'react-collapse-pane';
import Grid from 'src/lib/display/grid';
import Parser from 'src/parser/parser';
import { query } from './util';

const grid = Grid.createTilingSprite(5000, 5000);

type Example = {
  label: string;
  file: string;
};

const examples: Example[] = [
  { label: 'Positioning', file: 'positioning' },
  { label: 'Margins', file: 'margins' },
  { label: 'Padding', file: 'padding' },
];

const getExamplePageUrl = (example: string) =>
  `${location.protocol}//${location.host}/?example=${example}`;

const getExampleXmlUrl = (example: string) =>
  `${location.protocol}//${location.host}/examples/${example}.xml`;

export default function App() {
  const [xmlSrc, setXmlSrc] = useState<string>();
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
              width: 500,
              height: 500,
              container: container,
              resizeTo: container,
              deferInit: true,
            });
            doc.stage.addChildAt(grid, 0);
            doc.init();
            setXmlSrc(xml);
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
      <div id="container">
        <SplitPane split="vertical" collapse={true}>
          <div id="code">
            {xmlSrc ? (
              <SyntaxHighlighter language="xmlDoc" style={theme}>
                {xmlSrc}
              </SyntaxHighlighter>
            ) : null}
          </div>
          <div id="example" ref={containerRef}></div>
        </SplitPane>
      </div>
    </div>
  );
}
