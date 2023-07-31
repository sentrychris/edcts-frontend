import EventDispatcher from './dispatcher';

export class SystemDispatch extends EventDispatcher {
  map() {
    this.dispatchEvent({
      type: 'map',
      message: 'system mapped'
    });
  }
}

export const systemDispatcher = new SystemDispatch;