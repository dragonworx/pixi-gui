import Property, { PropertyListener } from '../../../core/property/property';

describe.skip('Property', () => {
  it('should raise callback on listener when changed', () => {
    const listener = {
      onPropertyChanged: jest.fn(),
    } as PropertyListener;
    const prop = new Property(listener, 'test', 5);
    prop.set(10);
    expect(listener.onPropertyChanged).toHaveBeenCalledWith('test', 10, 5);
  });
});
