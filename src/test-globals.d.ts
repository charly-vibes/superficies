declare module 'node:test' {
  interface TestContext {}

  type TestFn = (context: TestContext) => void | Promise<void>;

  export default function test(name: string, fn: TestFn): void;
}

declare module 'node:assert/strict' {
  interface Assert {
    deepEqual(actual: unknown, expected: unknown, message?: string): void;
    equal(actual: unknown, expected: unknown, message?: string): void;
    match(actual: string, regexp: RegExp, message?: string): void;
  }

  const assert: Assert;
  export default assert;
}
