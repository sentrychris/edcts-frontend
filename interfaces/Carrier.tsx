import { Commander } from './Commander';

export interface Carrier {
  name: string;
  identifier: string;
  commander: Commander;
  has_refuel: boolean;
  has_repair: boolean;
  has_armory: boolean;
  has_shipyard: boolean;
  has_outfitting: boolean;
  has_cartogrpahics: boolean;
}