import { System } from '../interfaces/System';
import { MappedSystemBody } from '../interfaces/SystemBody';
import EventDispatcher from './EventDispatcher';

export class SystemDispatcher extends EventDispatcher {
  message({ message }: { message: string }) {
    this.dispatchEvent({
      type: 'message',
      message: message
    });
  }

  selectBody({ body }: { body: MappedSystemBody }) {
    this.dispatchEvent({
      type: 'select-body', 
      message: body
    });
  }

  selectSystem({ system }: { system: System }) {
    this.dispatchEvent({
      type: 'select-system',
      message: system
    });
  }

  displayBodyInformationWidget({ body, closer, position }: {
    body: MappedSystemBody,
    closer: boolean,
    position: {
      top: number,
      left: number,
      right: number,
      bottom: number,
      width: number,
      height: number
    }
  }) {
    this.dispatchEvent({
      type: 'display-body-info',
      message: { body, closer, position }
    });
  }

  setIndex(index: number) {
    this.dispatchEvent({
      type: 'set-index',
      message: index
    });
  }
}

export const systemDispatcher = new SystemDispatcher;