import { System } from '../interfaces/System';
import { CelestialBody, MappedCelestialBody } from '../interfaces/Celestial';
import EventDispatcher from './dispatcher';

export class SystemDispatch extends EventDispatcher {
  message({ message }: { message: string }) {
    this.dispatchEvent({
      type: 'message',
      message: message
    });
  }

  selectBody({ body }: { body: CelestialBody }) {
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
    position: {top: number, left: number, right: number, bottom: number}
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