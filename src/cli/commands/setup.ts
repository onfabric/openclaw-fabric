import { prompt } from '../../lib/cli';
import { saveFabricPluginConfig } from '../../lib/config';
import { replaceContentInWorkspaceFile, WorkspaceFile } from '../../lib/openclaw';
import { getSkillPath, Skill } from '../../lib/skills';
import type { CommandCtx } from '../types';

const FABRIC_PLUGIN_HEARTBEAT_CONTENT = `# HEARTBEAT.md

## Check-in with the user
- follow the guidelines of this skill: \`${getSkillPath(Skill.USER_CHECK_IN)}\`
`;

function register({ cmd, config, workspaceDir }: CommandCtx) {
  cmd
    .command('setup')
    .description('Configure the Fabric CLI')
    .action(async () => {
      console.log('\n🧠 Fabric Setup\n');
      console.log('Get your API key and user ID from: https://developer.onfabric.io\n');

      const apiKey = await prompt('Enter your Fabric API key: ');
      if (!apiKey) {
        console.error('\nNo API key provided. Setup cancelled.');
        return;
      }

      const userId = await prompt('Enter your Fabric user ID: ');
      if (!userId) {
        console.error('\nNo user ID provided. Setup cancelled.');
        return;
      }

      saveFabricPluginConfig(config, { apiKey, userId });

      console.log('\n✓ Configuration saved to ~/.openclaw/openclaw.json');

      if (workspaceDir) {
        console.log(`\nWorkspace directory is available: ${workspaceDir}`);
        replaceContentInWorkspaceFile(
          workspaceDir,
          WorkspaceFile.HEARTBEAT,
          FABRIC_PLUGIN_HEARTBEAT_CONTENT,
        );
      } else {
        console.warn('\n⚠ Workspace directory is not available. Cannot update workspace files.');
      }

      console.log('\n✓ Configuration complete.');
      console.log('  Restart the OpenClaw gateway to apply changes: openclaw gateway restart\n');
    });
}

export const command = {
  register,
};
