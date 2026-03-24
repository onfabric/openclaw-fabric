import { prompt } from '../../lib/cli';
import { saveOpenClawConfig } from '../../lib/openclaw';
import type { CommandCtx } from '../types';

function register({ cmd, config }: CommandCtx) {
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

      if (!config.plugins) {
        config.plugins = {};
      }
      if (!config.plugins.entries) {
        config.plugins.entries = {};
      }

      config.plugins.entries['openclaw-fabric'] = {
        enabled: true,
        config: {
          apiKey,
          userId,
        },
      };

      saveOpenClawConfig(config);

      console.log('\n✓ Configuration saved to ~/.openclaw/openclaw.json');
      console.log('  Restart the OpenClaw gateway to apply changes: openclaw gateway restart\n');
    });
}

export const command = {
  register,
};
