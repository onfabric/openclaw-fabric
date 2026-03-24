import { prompt } from '../../lib/cli';
import { saveFabricPluginConfig } from '../../lib/config';
import { appendContentToWorkspaceFile, WorkspaceFile } from '../../lib/openclaw';
import type { CommandCtx } from '../types';

const FABRIC_PLUGIN_HEARTBEAT_CONTENT = '## Explore recent interactions\n\n- Use the Fabric plugin';

function register({ cmd, config, workspaceDir }: CommandCtx) {
  cmd
    .command('setup')
    .description('Configure the Fabric CLI')
    .action(async () => {
      console.log('\n🧠 Fabric Setup\n');
      console.log('Get your API key and user ID from: https://developer.onfabric.io\n');

      const apiKey = await prompt('Enter your Fabric API key: ');
      if (!apiKey) {
        console.log('\nNo API key provided. Setup cancelled.');
        return;
      }

      const userId = await prompt('Enter your Fabric user ID: ');
      if (!userId) {
        console.log('\nNo user ID provided. Setup cancelled.');
        return;
      }

      saveFabricPluginConfig(config, { apiKey, userId });

      console.log('\n✓ Configuration saved to ~/.openclaw/openclaw.json');

      if (workspaceDir) {
        console.log(`Workspace directory is available: ${workspaceDir}`);
        appendContentToWorkspaceFile(
          workspaceDir,
          WorkspaceFile.HEARTBEAT,
          FABRIC_PLUGIN_HEARTBEAT_CONTENT,
        );
      }

      console.log('  Restart the OpenClaw gateway to apply changes: openclaw gateway restart\n');
    });
}

export const command = {
  register,
};
