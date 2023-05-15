import { GenerateId } from "@utils/generatePid";
import { GetWorkerURL } from "@utils/getWorkerUrl";
import { NormalisePath } from "@utils/pathNormaliser";
import { ThreadMessage } from "../types/threadMessage";
import { success } from "@core/kernel/commands/errors";

class Thread {
  public threadId: number;
  public worker: Worker;

  constructor(exePath: string) {
    this.threadId = GenerateId();
    this.worker = new Worker(GetWorkerURL(NormalisePath(exePath)), {
      type: "module",
    });
  }

  public Message(message: ThreadMessage): number {
    this.worker.postMessage(message);
    return success;
  }
}

export default Thread;
