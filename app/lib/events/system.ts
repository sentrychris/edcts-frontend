import { MappedSystemCelestial, SystemCelestial } from '../interfaces/System';
import EventDispatcher from './dispatcher';

export class SystemDispatch extends EventDispatcher {
  message({ message }: { message: string }) {
    this.dispatchEvent({
      type: 'message',
      message: message
    });
  }

  getSystemMap({ system }: { system: SystemCelestial }) {
    this.dispatchEvent({
      type: 'system',
      message: system
    });
  }
}

export const systemDispatcher = new SystemDispatch;