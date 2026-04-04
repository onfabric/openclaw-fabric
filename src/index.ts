import { definePluginEntry } from 'openclaw/plugin-sdk/plugin-entry';
import { createFabricClient } from './api/client';
import { registerCli } from './cli';
import { configSchema, PLUGIN_ID, parseConfig } from './lib/config';
import { registerListInteractionTypesTool } from './tools/list-interaction-types';
import { registerListInteractionsTool } from './tools/list-interactions';

export default definePluginEntry({
  id: PLUGIN_ID,
  name: 'OpenClaw Fabric',
  description: 'Sync interactions from various platforms and make them available to OpenClaw',
  configSchema,
  register(api) {
    const cfg = parseConfig(api.pluginConfig);

    registerCli(api);

    const { apiKey, userId } = cfg;
    if (!apiKey || !userId) {
      api.logger.warn(
        'openclaw-fabric: apiKey and/or userId are not set. Run `openclaw fabric setup` to configure the plugin.',
      );
      return;
    }

    const client = createFabricClient({ apiKey });

    registerListInteractionTypesTool(api, client);
    registerListInteractionsTool(api, client, userId);

    api.logger.info('openclaw-fabric: registered tools');
  },
});
