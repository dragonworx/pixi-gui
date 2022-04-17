export interface Props {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export const defaultProps: Props = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  width: 100,
  height: 100,
};

export interface State extends Props {}

export default class Element {
  state: State;

  constructor(props: Partial<Props> = {}) {
    this.state = {
      ...defaultProps,
      ...props,
    };
  }
}
