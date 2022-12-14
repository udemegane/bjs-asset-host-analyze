type AssertNonNullable = <T>(val: T) => asserts val is NonNullable<T>;
export const assertIsDefined: AssertNonNullable = <T>(
  val: T
): asserts val is NonNullable<T> => {
  if (val === undefined || val === null) {
    throw new Error(`Expected 'val' to be defined, but received ${val}`);
  }
};

const color = (col: string) => (str: string) => `\u001b[${col}m${str}\u001b[0m`;
export const colors = {
  black: color("30"),
  red: color("31"),
  green: color("32"),
  yellow: color("33"),
  blue: color("34"),
  magenta: color("35"),
  cyan: color("36"),
  white: color("37"),
};

// export type Result<T, E extends Error> = Success<T> | Failure<T>;
