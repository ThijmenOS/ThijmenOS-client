export class ErrorExit {
  public id: number;
  public event: string;
  public description: string;

  constructor(id: number, event: string, description: string) {
    this.id = id;
    this.event = event;
    this.description = description;
  }
}
