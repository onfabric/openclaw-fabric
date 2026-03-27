import { prompt } from '../../lib/cli';
import { saveFabricPluginConfig } from '../../lib/config';
import type { CommandCtx } from '../types';

function register({ cmd, config }: CommandCtx) {
  cmd
    .command('setup')
    .description('Configure the Fabric plugin credentials')
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

      console.log('\n✅ Configuration saved to ~/.openclaw/openclaw.json');
      console.log('  Restart the OpenClaw gateway to apply changes: openclaw gateway restart\n');
    });
}

export const command = {
  register,
};
