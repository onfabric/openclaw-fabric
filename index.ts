import { definePluginEntry } from 'openclaw/plugin-sdk/plugin-entry';
import { createFabricClient } from './api/client';
import { registerCli } from './cli';
import { configSchema, parseConfig } from './lib/config';
import { registerListInteractionTypesTool } from './tools/list-interaction-types';
import { registerListThreadsTool } from './tools/list-threads';
import { registerSearchMemoriesTool } from './tools/search-memories';

const PLUGIN_ID = 'openclaw-fabric';
const PLUGIN_NAME = 'OpenClaw Fabric';
const PLUGIN_DESCRIPTION = 'Portable AI memory for OpenClaw';

export default definePluginEntry({
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  description: PLUGIN_DESCRIPTION,
  configSchema,
  register(api) {
    const cfg = parseConfig(api.pluginConfig);

    registerCli(api);

    const { apiKey, userId } = cfg;
    if (!apiKey || !userId) {
      api.logger.warn('openclaw-fabric: apiKey and userId must be set in plugin config');
      return;
    }

    const client = createFabricClient({ apiKey });

    registerListInteractionTypesTool(api, client);
    registerListThreadsTool(api, client, userId);
    registerSearchMemoriesTool(api, client, userId);

    api.logger.info('openclaw-fabric: registered tools');
  },
});
