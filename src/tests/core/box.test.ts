import EventEmitter from 'eventemitter3';
const mockContainer = new EventEmitter();
(mockContainer as any).transform = jest.fn();

jest.mock('pixi.js', () => ({
  Container: jest.fn().mockImplementation(() => mockContainer),
}));

import Box from '../../core/box';

describe('Box', () => {
  describe('Properties', () => {
    // const setup = () => {
    //   const box = new Box();
    //   const mock = jest.fn();
    //   box.on('propchange', () => {
    //     console.log('!!!');
    //   });
    //   console.log('EDD', box.x);
    //   return { box, mock };
    // };
    // it('should know when position changes happen', () => {
    //   const { box, mock } = setup();
    //   box.x = 50;
    //   // box.y = 50;
    //   expect(mock).toHaveBeenCalled();
    // });
    // it('should know when position changes happen', () => {
    //   const box = new Box();
    //   const mock = jest.fn();
    //   box.on("propchange", mock);
    //   box.x = 50;
    //   box.y = 50;
    //   box.width = 100;
    //   box.height = 200;
    //   box.margin.left = 1;
    //   box.margin.top = 2;
    //   box.margin.right = 3;
    //   box.margin.bottom = 4;
    //   box.padding.left = 5;
    //   box.padding.top = 6;
    //   box.padding.right = 7;
    //   box.padding.bottom = 8;
    //   box.anchors.left = 9;
    //   box.anchors.top = 10;
    //   box.anchors.right = 11;
    //   box.anchors.bottom = 12;
    // });
  });
});
