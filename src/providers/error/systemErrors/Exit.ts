class Exit<T = string> {
  public id: number;
  public data: T | string;

  constructor(id?: number, data?: T) {
    this.id = id || 0;
    this.data = data || "Command exited with no exeptions";
  }
}

export default Exit;
