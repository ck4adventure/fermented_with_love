/**
 * Builds a proxy that mimics drizzle's fluent query builder: every property
 * access returns a chainable function, and the proxy itself resolves (via
 * `then`) to the given result when awaited.
 */
export function chainMock(result: unknown) {
  const proxy: unknown = new Proxy(function chain() {}, {
    get(_target, prop) {
      if (prop === 'then') {
        return (resolve: (value: unknown) => void) => resolve(result);
      }
      return () => proxy;
    },
  });
  return proxy;
}
