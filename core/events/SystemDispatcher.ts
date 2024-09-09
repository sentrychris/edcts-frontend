import type { System } from "../interfaces/System";
import type { MappedSystemBody } from "../interfaces/SystemBody";
import EventDispatcher from "./EventDispatcher";

export class SystemDispatcher extends EventDispatcher {
  selectBody({ body, type }: { body: MappedSystemBody, type: string }) {
    this.dispatchEvent({
      type,
      message: body,
    });
  }

  selectSystem({ system }: { system: System }) {
    this.dispatchEvent({
      type: "select-system",
      message: system,
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
