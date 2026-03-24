import { execSync } from 'node:child_process';

export function exec(command: string): string {
  return execSync(command, { encoding: 'utf-8' });
}
