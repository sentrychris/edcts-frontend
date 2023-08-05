import json from '../public/fonts/icarus-terminal/icarus-terminal.json';
import { SURFACE_PORTS, PLANETARY_BASES } from './lib/constants/celestial';

type IconTypes = Record<string, Array<string>>

class _ProxyHandler {}

const _IconsProxy = {
  get(name: string) {
    const data = (json as IconTypes);
    let key = name.toLowerCase().replaceAll(' ', '-');

    if (!data[key]) {
      if (PLANETARY_BASES.includes(name)) key = 'settlement';
      if (SURFACE_PORTS.includes(name)) key = 'planetary-port';
      if (name === 'Mega ship') key = 'megaship';
    }

    if (data[key]) {
      return data[key].map((path, i) => <path key={`icon-${key}-${i}`} d={path} />);
    } else {
      console.error('Unsupported icon:', name);
      console.info('Supported icons: ', data);
      return null;
    }
  }
};

const Icons = new Proxy(_IconsProxy, new _ProxyHandler);

export default Icons;
