import yoga, {
  Node as YogaNode,
  EDGE_LEFT,
  EDGE_TOP,
  EDGE_RIGHT,
  EDGE_BOTTOM,
  ALIGN_CENTER,
  JUSTIFY_CENTER,
} from 'yoga-layout-prebuilt';

const root = YogaNode.create();
root.setAlignItems(ALIGN_CENTER);
root.setJustifyContent(JUSTIFY_CENTER);
root.setWidth(100);
root.setHeight(100);

const sub = YogaNode.create();
sub.setWidth(10);
sub.setHeight(10);

root.insertChild(sub, 0);

sub.setMargin(EDGE_LEFT, 10);
sub.setPosition(EDGE_LEFT, 10);

root.calculateLayout();

const { left, top, width, height } = sub.getComputedLayout();
console.log({ left, top, width, height });
