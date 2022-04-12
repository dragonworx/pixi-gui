import DeepDiff from 'deep-diff';
import DOMNode from './node';

enum DiffType {
  New = 'N',
  Deleted = 'D',
  Edited = 'E',
  Array = 'A',
}

export interface WithState<T> {
  setState(state: T): void;
}

export default abstract class Component<Props extends {}>
  extends DOMNode
  implements WithState<Props>
{
  protected state: Props;

  constructor(readonly props: Partial<Props> = {}) {
    super();

    this.state = {
      ...this.defaultProps(),
      ...props,
    };
  }

  init() {
    super.init();

    this.setState(this.state, true);
  }

  protected abstract defaultProps(): Props;

  setState(state: Partial<Props>, forceUpdate: boolean = false) {
    const { state: oldState } = this;

    this.state = {
      ...oldState,
      ...state,
    };

    const diffs = DeepDiff.diff(oldState, this.state);

    type PropKey = keyof Props;
    type PropValue = Props[keyof Props];

    if (diffs) {
      diffs.forEach(diff => {
        const { kind } = diff;
        if (kind === DiffType.New) {
          const state = diff.rhs;
          for (const [k, v] of Object.entries(state)) {
            const key = k as PropKey;
            this.notifyStateChangeIfDifference(
              key,
              v as PropValue,
              oldState[key]
            );
          }
        } else if (kind === DiffType.Edited && diff.path) {
          const key = diff.path[0] as PropKey;
          this.notifyStateChangeIfDifference(
            key,
            diff.rhs as unknown as PropValue,
            diff.lhs as unknown as PropValue
          );
        }
      });
    } else if (forceUpdate) {
      console.log('INIT');
      const defaultProps = this.defaultProps();
      for (const [k] of Object.entries(this.state)) {
        const key = k as PropKey;
        this.onStateChange(key, this.state[key], defaultProps[key]);
      }
    }
  }

  private notifyStateChangeIfDifference(
    key: keyof Props,
    value: Props[keyof Props],
    oldValue: Props[keyof Props]
  ) {
    if (value !== oldValue) {
      this.onStateChange(key, value, oldValue);
    }
  }

  abstract onStateChange(
    key: keyof Props,
    value: Props[keyof Props],
    oldValue: Props[keyof Props]
  ): void;
}
