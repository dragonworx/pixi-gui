import Transition, { TransitionKeys } from '../transition';
import NodeWithState, { BaseProps } from './nodeWithState';

export interface Props extends BaseProps {
  xDuration: number;
  yDuration: number;
  widthDuration: number;
  heightDuration: number;
  alphaDuration: number;
}

export const defaultDuration = 0;

export default abstract class NodeWithTransitions<P> extends NodeWithState<
  P & BaseProps
> {
  _transitions: Transition;

  constructor(readonly props: Partial<P & BaseProps> = {}) {
    super(props);

    const transitions = (this._transitions = new Transition(this));

    TransitionKeys.forEach(key => {
      const property = `${key}Duration`;
      Object.defineProperty(this, property, {
        get() {
          return transitions.getDuration(key);
        },
        set(value: number) {
          transitions.setDuration(key, value);
        },
      });
      transitions.initKey(key, defaultDuration);
    });
  }

  protected defaultProps(): P & BaseProps {
    return {
      ...super.defaultProps(),
    };
  }

  set allDuration(value: number) {
    TransitionKeys.forEach(key => {
      this._transitions.setDuration(key, value);
    });
  }
}
