import { Type } from '@sinclair/typebox';
import type { OpenClawPluginApi } from 'openclaw/plugin-sdk/plugin-entry';
import type { FabricClient } from '../api/client';
import { registerTool } from '../lib/register-tool';

const ListInteractionTypesToolParametersSchema = Type.Object({});

export function registerListInteractionTypesTool(
  api: OpenClawPluginApi,
  client: FabricClient,
): void {
  registerTool(api, {
    name: 'fabric_list_interaction_types',
    label: 'List Fabric Interaction Types',
    description:
      'List all available Fabric interaction types. ' +
      'Use the desired type as the interaction_type argument of other tools.',
    parameters: ListInteractionTypesToolParametersSchema,
    async execute(_id, _params) {
      const { data, error } = await client.GET('/interaction-types', { params: {} });

      if (error) {
        const errorDetails = { status: 'failed' as const, error };
        return {
          content: [
            { type: 'text', text: `Error fetching interaction types: ${JSON.stringify(error)}` },
          ],
          details: errorDetails,
        };
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(data.interaction_types) }],
        details: data.interaction_types,
      };
    },
  });
}
