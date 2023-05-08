import Exit from "@providers/error/systemErrors/Exit";
import { GenerateId } from "@utils/generatePid";
import { GetWorkerURL } from "@utils/getWorkerUrl";
import { NormalisePath } from "@utils/pathNormaliser";
import { ThreadMessage } from "../types/threadMessage";

class Thread {
  public threadId: number;
  public worker: Worker;

  constructor(exePath: string) {
    this.threadId = GenerateId();
    this.worker = new Worker(GetWorkerURL(NormalisePath(exePath)), {
      type: "module",
    });
  }

  public Message(message: ThreadMessage): Exit {
    this.worker.postMessage(message);
    return new Exit(0);
  }
}

export default Thread;
