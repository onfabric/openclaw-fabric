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
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  const configPath = getOpenClawConfigFilePath(configDir);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export enum WorkspaceFile {
  HEARTBEAT = 'HEARTBEAT.md',
}

export function appendContentToWorkspaceFile(
  workspaceDir: string,
  filename: WorkspaceFile,
  content: string,
): void {
  console.log(`Modifying ${filename}...`);
  const workspaceFilePath = path.join(workspaceDir, filename);
  if (!fs.existsSync(workspaceFilePath)) {
    console.log(`${filename} does not exist. Creating and appending content...`);
    fs.writeFileSync(workspaceFilePath, content);
    console.log(`✓ ${filename} created`);
  } else {
    fs.appendFileSync(workspaceFilePath, `\n${content}\n`);
    console.log(`✓ ${filename} updated`);
  }
}
