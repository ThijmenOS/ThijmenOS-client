import Exit from "@providers/error/systemErrors/Exit";
import { GenerateId } from "@utils/generatePid";

class MessageBus {
  private _bufferSize: number;
  private _queue: Array<string | number> = new Array<string | number>();

  public messageBusId: number;
  public ownerPid: number;
  public receivingPid: number;

  constructor(ownerPid: number, receivingPid: number, bufferSize?: number) {
    this.ownerPid = ownerPid;
    this.receivingPid = receivingPid;
    this._bufferSize = bufferSize ?? 0;

    this.messageBusId = GenerateId();
  }

  public Send(message: string | number): Exit {
    if (this._queue.length >= this._bufferSize) return new Exit(-1);

    this._queue.push(message);
    return new Exit();
  }

  public Read(): null | string | number {
    if (this._queue.length === 0) return null;

    const message = this._queue.shift();
    if (!message) return null;

    return message;
  }
}

export default MessageBus;