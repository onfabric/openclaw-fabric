import { definePluginEntry } from 'openclaw/plugin-sdk/plugin-entry';

const PLUGIN_ID = 'openclaw-fabric';
const PLUGIN_NAME = 'OpenClaw Fabric';
const PLUGIN_DESCRIPTION = 'Portable AI memory for OpenClaw';

export default definePluginEntry({
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  description: PLUGIN_DESCRIPTION,
  register(_api) {
    console.log('OpenClaw Fabric plugin registered');
  },
});
