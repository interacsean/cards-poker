export function tap<T>(fn: (arg: T) => void) {
  return (arg: T) => {
    fn(arg);
    return arg;
  };
}
