import DOM from './document';
import Hierarchical from './hierarchical';

export default abstract class DOMNode extends Hierarchical {
  _document?: DOM;
  _hasInit: boolean = false;

  get document() {
    return this._document;
  }

  setDocument(dom: DOM) {
    this._document = dom;
  }

  getDocument() {
    const { document } = this;

    if (document) {
      return document;
    }

    let node: DOMNode | null = this;

    while (node) {
      if (node.document) {
        return node.document;
      }
      node = node.getParent<DOMNode>();
    }

    throw new Error('Node is not in a document');
  }

  addChild(child: DOMNode): void {
    super.addChild(child);
    child.init();
  }

  init() {
    this._hasInit = true;
  }
}
