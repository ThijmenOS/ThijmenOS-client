class Exit {
  public id: number;
  public event: string;
  public description: string;

  constructor(id?: number, event?: string, description?: string) {
    this.id = id || 0;
    this.event = event || "Success";
    this.description = description || "Command exited with no exeptions";
  }
}

export default Exit;
