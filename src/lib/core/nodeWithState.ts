import DeepDiff from 'deep-diff';
import Node from './node';
import Transition from './transition';

let id = 0;
const nextId = () => String(id++);

enum DiffType {
  New = 'N',
  Deleted = 'D',
  Edited = 'E',
  Array = 'A',
}

export interface WithState<T> {
  setState(state: T): void;
}

export interface BaseProps {
  id: string;
}

export default abstract class NodeWithState<Props extends BaseProps>
  extends Node
  implements WithState<Props>
{
  protected state: Props;
  _transitions: Transition;

  constructor(readonly props: Partial<Props> = {}) {
    super();

    this.state = {
      ...this.defaultProps(),
      ...props,
    };

    this._transitions = new Transition(this);
  }

  get id() {
    return this.state.id;
  }

  init() {
    super.init();

    this.setState(this.state, true);
  }

  protected defaultProps(): Props {
    return {
      id: nextId(),
    } as Props;
  }

  protected transitionKeys(): string[] {
    return [];
  }

  getState<T>(): T {
    return this.state as unknown as T;
  }

  setState<T>(state: Partial<T>, forceUpdate: boolean = false) {
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
      this.update();
    }
  }

  update() {
    const defaultProps = this.defaultProps();
    for (const [k] of Object.entries(this.state)) {
      const key = k as keyof Props;
      this.onStateChange(key, this.state[key], defaultProps[key]);
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

  abstract onStateChange<T>(
    key: keyof T,
    value: unknown,
    _oldValue: unknown
  ): void;

  setTransitionDuration(key: string, durationMs: number) {
    this._transitions.setDuration(key, durationMs);
  }

  setAllTransitionDuration(durationMs: number) {
    this.transitionKeys().forEach(key =>
      this._transitions.setDuration(key, durationMs)
    );
  }
}
