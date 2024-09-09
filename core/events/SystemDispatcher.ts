import type { System } from "../interfaces/System";
import type { MappedSystemBody } from "../interfaces/SystemBody";
import EventDispatcher from "./EventDispatcher";

export class SystemDispatcher extends EventDispatcher {
  message({ message }: { message: string }) {
    this.dispatchEvent({
      type: "message",
      message: message,
    });
  }

  selectBody({ body }: { body: MappedSystemBody }) {
    this.dispatchEvent({
      type: "select-body",
      message: body,
    });
  }

  selectSystem({ system }: { system: System }) {
    this.dispatchEvent({
      type: "select-system",
      message: system,
    });
  }

  displayBodyInformationWidget({ body }: { body: MappedSystemBody }) {
    this.dispatchEvent({
      type: "display-body-info",
      message: { body },
    });
  }

  setIndex(index: number) {
    this.dispatchEvent({
      type: "set-index",
      message: index,
    });
  }
}

export const systemDispatcher = new SystemDispatcher();
