import Themable from 'src/lib/node/themable';
import { Geometry } from '../display/style';

export default class Fill extends Themable {
  defaultGeometry(): Geometry {
    return {
      ...super.defaultGeometry(),
      fixture: {
        left: 0,
        top: 0,
        right: 1,
        bottom: 1,
      },
    };
  }
}
