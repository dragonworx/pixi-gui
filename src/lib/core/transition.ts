import { Tween } from 'tweenyweeny';
import { WithState } from './node/nodeWithState';
import { WithInit } from './node/node';

export const TransitionKeys = ['x', 'y', 'width', 'height', 'alpha'] as const;
export type TransitionKey = typeof TransitionKeys[number];

export default class Transition {
  transitions: Map<TransitionKey, Tween>;

  constructor(readonly target: WithState<any> & WithInit) {
    this.transitions = new Map();
  }

  get(key: TransitionKey) {
    const { transitions } = this;
    if (!transitions.has(key)) {
      throw new Error(`Tween for property "${key}" not defined`);
    }
    return transitions.get(key)!;
  }

  initKey(key: TransitionKey, duration: number = 1000) {
    const tween = new Tween(duration);
    this.transitions.set(key, tween);
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
