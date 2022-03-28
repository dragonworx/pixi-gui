import ThemableSurface from 'src/lib/node/themableSurface';
import { Geometry } from '../display/style';

export default class Fill extends ThemableSurface {
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
