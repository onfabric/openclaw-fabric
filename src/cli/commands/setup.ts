import { cron as deepUserProfileCron } from '../../crons/deep-user-profile';
import { prompt } from '../../lib/cli';
import { saveFabricPluginConfig } from '../../lib/config';
import {
  replaceContentInWorkspaceFile,
  WorkspaceFile,
  workspaceFileExists,
} from '../../lib/openclaw';
import { getSkillPath, Skill } from '../../lib/skills';
import type { CommandCtx } from '../types';

const FABRIC_PLUGIN_HEARTBEAT_CONTENT = `# HEARTBEAT.md

## Check-in with the user
- follow the guidelines of this skill: \`${getSkillPath(Skill.USER_CHECK_IN)}\`
`;

const FABRIC_PLUGIN_TOOLS_CONTENT = `# TOOLS.md - Local Notes

## Retrieve relevant user memories
Whenever the user is discussing any topic that could benefit from personalised context — such as travel plans, food preferences, relationships,
work, hobbies, health, entertainment, shopping, or values — read and follow this skill before responding: \`${getSkillPath(Skill.RETRIEVE_RELEVANT_USER_MEMORIES)}\`
`;

function register({ cmd, config, workspaceDir }: CommandCtx) {
  cmd
    .command('setup')
    .description('Configure the Fabric CLI')
    .action(async () => {
      console.log('\n⚙️ Fabric Setup\n');
      console.log('Get your API key and user ID from: https://developer.onfabric.io\n');

      const apiKey = await prompt('Enter your Fabric API key: ');
      if (!apiKey) {
        console.error('\n❌ No API key provided. Setup cancelled.');
        return;
      }

      const userId = await prompt('Enter your Fabric user ID: ');
      if (!userId) {
        console.error('\n❌ No user ID provided. Setup cancelled.');
        return;
      }

      saveFabricPluginConfig(config, { apiKey, userId });

      console.log('\n💾 Configuration saved to ~/.openclaw/openclaw.json');

      if (workspaceDir && workspaceFileExists(workspaceDir, WorkspaceFile.HEARTBEAT)) {
        console.log(`\n📂 Workspace directory is available: ${workspaceDir}`);
        replaceContentInWorkspaceFile(
          workspaceDir,
          WorkspaceFile.HEARTBEAT,
          FABRIC_PLUGIN_HEARTBEAT_CONTENT,
        );
      } else {
        console.warn(
          `\n⚠️ Workspace directory or ${WorkspaceFile.HEARTBEAT} file is not available.`,
        );
        console.warn('  Start at least one conversation with your OpenClaw first.');
      }

      if (workspaceDir && workspaceFileExists(workspaceDir, WorkspaceFile.TOOLS)) {
        replaceContentInWorkspaceFile(
          workspaceDir,
          WorkspaceFile.TOOLS,
          FABRIC_PLUGIN_TOOLS_CONTENT,
        );
      } else {
        console.warn(`\n⚠️ Workspace directory or ${WorkspaceFile.TOOLS} file is not available.`);
        console.warn('  Start at least one conversation with your OpenClaw first.');
      }

      await deepUserProfileCron.register();

      console.log('\n✅ Configuration complete.');
      console.log('  Restart the OpenClaw gateway to apply changes: openclaw gateway restart\n');
    });
}

export const command = {
  register,
};
