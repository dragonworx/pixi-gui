import { Tween } from 'tweenyweeny';
import { WithState } from './component';

export default class Transition<T extends string> {
  transitions: Map<T, Tween>;

  constructor(readonly target: WithState<any>) {
    this.transitions = new Map();
  }

  get(key: T) {
    const { transitions } = this;
    if (!transitions.has(key)) {
      throw new Error(`Tween for property "${key}" not defined`);
    }
    return transitions.get(key)!;
  }

  set(key: T, duration: number) {
    const tween = new Tween(duration);
    this.transitions.set(key, tween);
    tween.on('update', value => this.target.setState({ [key]: value }));
    return this;
  }

  setDuration(key: T, duration: number) {
    this.get(key).durationMs = duration;
  }
}
