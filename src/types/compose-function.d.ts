declare module 'compose-function' {
  type Func<T extends any[], R> = (...args: T) => R;

  /**
   * Compose functions from right to left
   */
  function compose<R>(...funcs: Array<Func<any, any>>): Func<any, R>;

  export default compose;
}
