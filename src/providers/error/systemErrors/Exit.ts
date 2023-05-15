//TODO: Create logger to log errors

class Exit<T = string> {
  public code: number;
  public data: T | string;

  constructor(code?: number, data?: T) {
    this.code = code ?? 0;
    this.data = data ?? "success";

    if (this.code !== 0) {
      console.error(data);
    }
  }
}

export default Exit;
