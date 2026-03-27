import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import type { OpenClawConfig } from 'openclaw/plugin-sdk';

function getOpenClawConfigDir(): string {
  return path.join(os.homedir(), '.openclaw');
}

function getOpenClawConfigFilePath(configDir: string): string {
  return path.join(configDir, 'openclaw.json');
}

export function saveOpenClawConfig(config: OpenClawConfig): void {
  const configDir = getOpenClawConfigDir();
  fs.mkdirSync(configDir, { recursive: true });

  const configPath = getOpenClawConfigFilePath(configDir);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
