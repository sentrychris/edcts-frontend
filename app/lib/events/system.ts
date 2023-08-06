import { System } from '../interfaces/System';
import { MappedCelestialBody } from '../interfaces/Celestial';
import EventDispatcher from './dispatcher';

export class SystemDispatch extends EventDispatcher {
  message({ message }: { message: string }) {
    this.dispatchEvent({
      type: 'message',
      message: message
    });
  }

  selectBody({ body }: { body: MappedCelestialBody }) {
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

  displayBodyInfo({ body, closer, position }: {
    body: MappedCelestialBody,
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

export const systemDispatcher = new SystemDispatch;