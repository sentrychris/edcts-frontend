export interface CommanderApi {
  inara: string;
  edsm: string;
}

export interface Commander {
  name: string;
  api?: CommanderApi;
}
