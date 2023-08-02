import { MappedSystemCelestial, System, SystemCelestial } from '../interfaces/System';
import EventDispatcher from './dispatcher';

export class SystemDispatch extends EventDispatcher {
  message({ message }: { message: string }) {
    this.dispatchEvent({
      type: 'message',
      message: message
    });
  }

  selectBody({ celestial }: { celestial: SystemCelestial }) {
    this.dispatchEvent({
      type: 'select-celestial', 
      message: celestial
    });
  }

  selectSystem({ system }: { system: System }) {
    this.dispatchEvent({
      type: 'select-system',
      message: system
    });
  }
}

export const systemDispatcher = new SystemDispatch;