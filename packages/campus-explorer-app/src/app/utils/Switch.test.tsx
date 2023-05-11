import React from 'react';
import { ReactTestRendererJSON, create } from 'react-test-renderer';
import { Case, Default, Switch } from './Switch';
import { describe, test, expect } from 'vitest';

describe('Switch component', () => {
  test('Case only shows if matching Switch value', () => {
    const component = create(
      <Switch test={1}>
        <Case value={1}>
          <p>Test</p>
        </Case>
        <Case value={2}>
          <p>Fail</p>
        </Case>
      </Switch>
    );
    const tree = component.toJSON() as ReactTestRendererJSON;
    expect(tree).not.toBeNull();
    expect(tree.type).toBe('p');
    expect(tree.children?.[0]).toEqual('Test');
  });

  test('Only first matching Case shows', () => {
    const component = create(
      <Switch test={1}>
        <Case value={1}>
          <p>Test</p>
        </Case>
        <Case value={1}>
          <p>Fail</p>
        </Case>
      </Switch>
    );
    const tree = component.toJSON() as ReactTestRendererJSON;
    expect(tree).not.toBeNull();
    expect(tree.type).toBe('p');
    expect(tree.children?.[0]).toEqual('Test');
  });
  test('Default only happens if no matching case', () => {
    const component = create(
      <Switch test={5}>
        <Case value={5}>
          <p>Test</p>
        </Case>
        <Default>
          <p>Fail</p>
        </Default>
      </Switch>
    );
    const tree = component.toJSON() as ReactTestRendererJSON;
    expect(tree).not.toBeNull();
    expect(tree.type).toBe('p');
    expect(tree.children?.[0]).toEqual('Test');
  });
  test('Default does happen if no matching case', () => {
    const component = create(
      <Switch test={5}>
        <Case value={6}>
          <p>Fail</p>
        </Case>
        <Default>
          <p>Test</p>
        </Default>
      </Switch>
    );
    const tree = component.toJSON() as ReactTestRendererJSON;
    expect(tree).not.toBeNull();
    expect(tree.type).toBe('p');
    expect(tree.children?.[0]).toEqual('Test');
  });
});
