import { homedir } from 'os';
import { join } from 'path';
import { existsSync } from 'fs';

function getLogDir (saveGameDir: string) {
  const fallback = join(homedir(), 'Saved Games', 'Frontier Developments', 'Elite Dangerous');
  let logDir = fallback;

  // For development (or on Unix platforms) you can use the LOG_DIR environment
  // variable to specify the direct path (relative or absolute). You can also
  // use a .env file. This is overriden by command line args.
  if (process.env.LOG_DIR) {
    logDir = process.env.LOG_DIR.startsWith('/') ? process.env.LOG_DIR : join(__dirname, process.env.LOG_DIR);
  }
  
  // Use provided Save Game dir as base path to look for the the files we need
  // This must be obtained via native OS APIs so is typically passed by the client.
  if (saveGameDir) {
    // The option can be a path to a Windows Save Game directory (in which case
    // we append 'Frontier Developments\Elite Dangerous') or the direct path.
    // If it doesn't look like a valid Save Game dir then it is treated it as a
    // direct path.
    const FullPathToSaveGameDir = join(saveGameDir, 'Frontier Developments', 'Elite Dangerous');
    if (existsSync(FullPathToSaveGameDir)) {
      logDir = FullPathToSaveGameDir;
    } else {
      logDir = saveGameDir;
    }
  }

  return logDir;
}