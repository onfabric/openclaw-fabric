import type { OpenClawPluginConfigSchema } from 'openclaw/plugin-sdk';

type Config = {
  apiKey: string;
  userId: string;
};

export function parseConfig(raw: unknown): Config {
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
