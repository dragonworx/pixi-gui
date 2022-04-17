import { Tween } from 'tweenyweeny';
import NodeWithState from './node/nodeWithState';

export const TransitionKeys = [
  'x',
  'y',
  'width',
  'height',
  'alpha',
  'marginLeft',
  'marginTop',
  'marginBottom',
  'marginRight',
] as const;
export type TransitionKey = typeof TransitionKeys[number];

export default class Transition {
  _transitions: Map<TransitionKey, Tween>;

  constructor(readonly target: NodeWithState<any>) {
    this._transitions = new Map();
  }

  get(key: TransitionKey) {
    const { _transitions: transitions } = this;
    if (!transitions.has(key)) {
      throw new Error(`Tween for property "${key}" not defined`);
    }
    return transitions.get(key)!;
  }

  initKey(key: TransitionKey, duration: number = 1000) {
    const tween = new Tween(duration);
    this._transitions.set(key, tween);
    tween.on('update', value => this.target.setState({ [key]: value }));
    return this;
  }

  setDuration(key: TransitionKey, duration: number) {
    this.get(key).duration = duration;
  }

  getDuration(key: TransitionKey) {
    return this.get(key).duration;
  }

  start(key: TransitionKey, fromValue: number, toValue: number) {
    const { target } = this;
    const tween = this.get(key);
    if (target.hasInit && tween.duration > 0) {
      this.get(key).start(fromValue, toValue);
    } else {
      target.setState({ [key]: toValue });
    }
  }
}
