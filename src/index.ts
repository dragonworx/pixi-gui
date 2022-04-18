// import './tests/genisis';
// import './examples/main';
import './tests/core';
// import './tests/yoga';

interface AProps {
  x: number;
}

class A<AProp extends AProps> {
  props?: AProp;

  constructor(p: AProp) {
    this.props = p;
  }

  funcA() {
    this.props?.x;
  }

  getProps(): AProp {
    return this.props!;
  }
}

interface BProps extends AProps {
  y: number;
}

class B<BProp> extends A<BProp & BProps> {
  constructor(p: BProp & BProps) {
    super(p);
  }

  funcB() {
    this.props?.y;
  }

  getProps(): BProp & BProps {
    return this.props!;
  }
}

interface CProps extends BProps {
  z: number;
}

class C<CProp> extends B<CProp & CProps> {
  constructor(p: CProp & CProps) {
    super(p);
  }

  funcC() {
    this.props?.z;
  }

  getProps(): CProp & CProps {
    return this.props!;
  }
}
