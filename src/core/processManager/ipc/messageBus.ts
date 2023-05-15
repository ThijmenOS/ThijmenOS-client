import { GenerateId } from "@utils/generatePid";
import MqFlag from "../types/messageQueueFlags";
import Exit from "@providers/error/systemErrors/Exit";
import MessagebufferExceeded from "../errors/messageBufferExceeded";
import MessageBusSession from "../types/messageBusSession";
import MessageBusSessionNotFound from "../errors/messageBusSessionNotFound";

class MessageBus {
  private _bufferSize: number;
  private _queue: Array<string | number> = new Array<string | number>();

  public messageBusId: number;
  public ownerPid: number;
  public name: string;
  public args: Array<MqFlag>;

  private _openSessions: Array<MessageBusSession> = [];

  constructor(
    ownerPid: number,
    name: string,
    args: Array<MqFlag>,
    bufferSize?: number
  ) {
    this.ownerPid = ownerPid;
    this.name = name;
    this.args = args;
    this._bufferSize = bufferSize ?? 0;

    this.messageBusId = GenerateId();
  }

  public OpenSession(pid: number, flags: Array<MqFlag>): void {
    this._openSessions.push({ pid: pid, flags: flags });
  }

  public FindSession(pid: number): MessageBusSession | Exit {
    const session = this._openSessions.find((session) => session.pid === pid);
    if (!session) {
      return new MessageBusSessionNotFound();
    }

    return session;
  }

  public Send(message: string | number): Exit {
    if (this._queue.length >= this._bufferSize)
      return new MessagebufferExceeded();

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
