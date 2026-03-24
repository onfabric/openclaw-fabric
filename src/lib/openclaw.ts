import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import type { OpenClawConfig } from 'openclaw/plugin-sdk';
import { exec } from './exec';

export const DEFAULT_AGENT_ID = 'main';

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

export function replaceContentInWorkspaceFile(
  workspaceDir: string,
  filename: WorkspaceFile,
  content: string,
): void {
  console.log(`📝 Writing to ${filename}...`);
  const workspaceFilePath = path.join(workspaceDir, filename);
  fs.writeFileSync(workspaceFilePath, content);
  console.log(`✅ ${filename} updated`);
}

type CliCronAddOptions = {
  cronExpression: string;
  name: string;
  prompt: string;
};

export const cli = {
  cron: {
    add: ({ cronExpression, name, prompt }: CliCronAddOptions): string => {
      console.log(`📅 Adding cron job: ${name}`);

      const result = exec(
        `openclaw cron add --name ${name} --prompt "${prompt}" --cron "${cronExpression}"`,
      );

      console.log(`✅ Cron job added: ${name}`);

      return result;
    },
  },
};
