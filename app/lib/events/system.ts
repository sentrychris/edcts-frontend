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

  displayBodyInfo({ body }: { body: MappedCelestialBody }) {
    this.dispatchEvent({
      type: 'display-body-info',
      message: body
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