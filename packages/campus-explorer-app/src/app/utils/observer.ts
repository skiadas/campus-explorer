// TODO: Move callbacks to other file?
type Callback<T> = (data: T) => void;

export function setObserver<T>(): [
  (callback: Callback<T>) => number,
  (id: number) => void,
  (data: T) => void
] {
  let nextCallbackId = 0;
  const callbacks = new Map<number, Callback<T>>();

  function registerCallback(callback: Callback<T>): number {
    nextCallbackId += 1;
    callbacks.set(nextCallbackId, callback);
    return nextCallbackId;
  }

  function removeCallback(id: number): void {
    if (typeof id === 'number') callbacks.delete(id);
  }

  function notify(data: T): void {
    for (const cb of callbacks.values()) {
      cb.call(null, data);
    }
  }

  return [registerCallback, removeCallback, notify];
}
