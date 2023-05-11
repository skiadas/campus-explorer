import React, { ReactElement, ReactNode } from 'react';

export function Switch({
  test,
  children
}: {
  test: unknown;
  children?: ReactElement | ReactElement[];
}): ReactElement {
  let matched = false;
  const remainingChildren = React.Children.map(children, (child) => {
    if (matched) return null;
    const isDefault = child?.type == Default;
    const isCase = child?.type == Case;
    const isMatchingCase = isCase && child?.props.value == test;
    matched = isDefault || isMatchingCase;
    return matched ? child : null;
  });
  return <>{remainingChildren}</>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Case({ value, children }: { value: unknown; children?: ReactNode }): ReactElement {
  return <>{children}</>;
}

export function Default({ children }: { children: ReactNode }): ReactElement {
  return <>{children}</>;
}
