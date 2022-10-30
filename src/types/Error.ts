export const ERR = Symbol("ERR");
export type Err = {
  [ERR]: true;
  error: unknown;
  type?: ErrTypes;
};

export type ErrTypes = "AppNotFound";
