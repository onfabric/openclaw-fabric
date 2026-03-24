import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import type { OpenClawConfig } from 'openclaw/plugin-sdk';
import { execAsync } from './exec';

export const DEFAULT_AGENT_ID = 'main';

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

export enum WorkspaceFile {
  HEARTBEAT = 'HEARTBEAT.md',
  TOOLS = 'TOOLS.md',
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

export function workspaceFileExists(workspaceDir: string, filename: WorkspaceFile): boolean {
  const workspaceFilePath = path.join(workspaceDir, filename);
  return fs.existsSync(workspaceFilePath);
}

type CliCronAddOptions = {
  cronExpression: string;
  name: string;
  prompt: string;
};

type CronJob = {
  id: string;
  name: string;
  enabled: boolean;
};

type CliCronListResult = {
  jobs: CronJob[];
  total: number;
};

export const cli = {
  cron: {
    list: async (): Promise<CliCronListResult> => {
      const result = await execAsync('openclaw cron list --json');
      return JSON.parse(result);
    },

    add: async ({ cronExpression, name, prompt }: CliCronAddOptions): Promise<string> => {
      console.log(`📅 Adding cron job: ${name}`);

      const result = await execAsync(
        `openclaw cron add --name ${name} --cron "${cronExpression}" --message "${prompt}" --no-deliver`,
      );

      console.log(`✅ Cron job added: ${name}`);

      return result;
    },
  },
};
