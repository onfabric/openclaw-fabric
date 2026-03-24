import type { OpenClawConfig, OpenClawPluginConfigSchema } from 'openclaw/plugin-sdk';
import { saveOpenClawConfig } from './openclaw';

/**
 * The ID of the plugin as declared in the `openclaw.plugin.json` file.
 */
export const PLUGIN_ID = 'openclaw-fabric';

type FabricPluginConfig = {
  apiKey: string;
  userId: string;
};

export function parseConfig(raw: unknown): FabricPluginConfig {
  const cfg =
    raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};

  return {
    apiKey: cfg.apiKey as string,
    userId: cfg.userId as string,
  };
}

export const configSchema: OpenClawPluginConfigSchema = {
  jsonSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      apiKey: { type: 'string' },
      userId: { type: 'string' },
    },
  },
  parse: parseConfig,
};

export function saveFabricPluginConfig(
  config: OpenClawConfig,
  pluginConfig: FabricPluginConfig,
): void {
  config.plugins = config.plugins || {};
  config.plugins.entries = config.plugins.entries || {};

  config.plugins.entries[PLUGIN_ID] = {
    enabled: true,
    config: pluginConfig,
  };

  saveOpenClawConfig(config);
}
