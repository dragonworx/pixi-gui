import { Tween } from 'tweenyweeny';
import { WithState } from './nodeWithState';
import { WithInit } from './node';

export default class Transition {
  transitions: Map<string, Tween>;

  constructor(readonly target: WithState<any> & WithInit) {
    this.transitions = new Map();
  }

  get(key: string) {
    const { transitions } = this;
    if (!transitions.has(key)) {
      throw new Error(`Tween for property "${key}" not defined`);
    }
    return transitions.get(key)!;
  }

  initKey(key: string, duration: number = 0) {
    const tween = new Tween(duration);
    this.transitions.set(key, tween);
    tween.on('update', value => this.target.setState({ [key]: value }));
    return this;
  }

  setDuration(key: string, duration: number) {
    this.get(key).duration = duration;
  }

  start(key: string, fromValue: number, toValue: number) {
    const { target } = this;
    const tween = this.get(key);
    if (target.hasInit && tween.duration > 0) {
      this.get(key).start(fromValue, toValue);
    } else {
      target.setState({ [key]: toValue });
    }
  }
}
