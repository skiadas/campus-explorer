import { objectToArgsString } from './sam';
describe('objectToArgsString', () => {
  it('returns empty string if no arguments', () => {
    expect(objectToArgsString({})).toBe('');
  });
  it('keeps non-capital-letter arguments same', () => {
    expect(objectToArgsString({ foo: 'bar' })).toBe(' --foo "bar"');
  });
  it('converts single capital to lowercase with dash', () => {
    expect(objectToArgsString({ fooBar: 'baz' })).toBe(' --foo-bar "baz"');
  });
  it('converts multiple capital to lowercase with dash', () => {
    expect(objectToArgsString({ fooBarBaz: 'what' })).toBe(
      ' --foo-bar-baz "what"'
    );
  });
  it('properly spaces out multiple entries', () => {
    expect(objectToArgsString({ foo1: 'bar', foo2: 'baz' })).toBe(
      ' --foo1 "bar" --foo2 "baz"'
    );
  });
  it('includes a key with true boolean value and not one with false boolean value', () => {
    expect(objectToArgsString({ fooBar: true, bazBar: false })).toBe(
      ' --foo-bar'
    );
  });
});
