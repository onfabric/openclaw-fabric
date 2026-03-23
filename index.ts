import { definePluginEntry } from 'openclaw/plugin-sdk/plugin-entry';
import { createFabricClient } from './api/client';
import { registerListInteractionTypesTool } from './tools/list-interaction-types';
import { registerListThreadsTool } from './tools/list-threads';

const PLUGIN_ID = 'openclaw-fabric';
const PLUGIN_NAME = 'OpenClaw Fabric';
const PLUGIN_DESCRIPTION = 'Portable AI memory for OpenClaw';

export default definePluginEntry({
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  description: PLUGIN_DESCRIPTION,
  register(api) {
    const pluginConfig = api.pluginConfig as { apiKey: string; userId: string } | undefined;
    if (!pluginConfig?.apiKey || !pluginConfig?.userId) {
      api.logger.warn('openclaw-fabric: apiKey and userId must be set in plugin config');
      return;
    }

    const client = createFabricClient({ apiKey: pluginConfig.apiKey });
    const { userId } = pluginConfig;

    registerListInteractionTypesTool(api, client);
    registerListThreadsTool(api, client, userId);
  },
});
