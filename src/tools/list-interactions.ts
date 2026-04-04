import { Type } from '@sinclair/typebox';
import type { OpenClawPluginApi } from 'openclaw/plugin-sdk/plugin-entry';
import type { FabricClient } from '../api/client';
import { PageSortDirection } from '../api/openapi';
import { registerTool } from '../lib/register-tool';

const DEFAULT_PAGE_SIZE = 20;

const ListInteractionsToolParametersSchema = Type.Object({
  interaction_type: Type.Optional(
    Type.String({
      description:
        'Filter by interaction type. Call fabric_list_interaction_types first to see valid values.',
    }),
  ),
  from_date: Type.Optional(
    Type.String({
      description: 'Only return interactions from this date onwards (ISO 8601 format).',
    }),
  ),
  to_date: Type.Optional(
    Type.String({
      description: 'Only return interactions up to this date (ISO 8601 format).',
    }),
  ),
  direction: Type.Optional(
    Type.Enum(PageSortDirection, {
      description: 'Sort direction: "asc" (oldest first) or "desc" (newest first, default).',
    }),
  ),
  page_size: Type.Optional(
    Type.Number({
      description: 'Number of interactions to return per page.',
      minimum: 1,
      maximum: 100,
      default: DEFAULT_PAGE_SIZE,
    }),
  ),
  page_token: Type.Optional(
    Type.String({
      description: 'Token to continue listing interactions from a previous page.',
    }),
  ),
});

export function registerListInteractionsTool(
  api: OpenClawPluginApi,
  client: FabricClient,
  userId: string,
): void {
  registerTool(api, {
    name: 'fabric_list_interactions',
    label: 'List Fabric Interactions',
    description: "List the user's interactions on various digital platforms.",
    parameters: ListInteractionsToolParametersSchema,
    async execute(_id, params) {
      api.logger.info('openclaw-fabric: listing interactions...');

      const { data, error } = await client.GET('/users/{user_id}/threads', {
        params: {
          path: { user_id: userId },
          query: {
            interaction_type: params.interaction_type ?? null,
            from_date: params.from_date ?? null,
            to_date: params.to_date ?? null,
            page_size: params.page_size || DEFAULT_PAGE_SIZE,
            direction: params.direction ?? null,
            page_token: params.page_token ?? null,
          },
        },
      });

      if (error) {
        return {
          content: [{ type: 'text', text: `Error fetching interactions: ${JSON.stringify(error)}` }],
          details: error,
        };
      }

      const interactions = data.items.map((item) => ({
        asat: item.asat ?? null,
        preview: item.preview ?? null,
        asset_description: item.asset_description ?? null,
      }));

      const text = interactions
        .map((t, i) => {
          const parts = [`${i + 1}.`];
          if (t.asat) parts.push(`Date: ${t.asat}`);
          if (t.preview) parts.push(`Preview: ${t.preview}`);
          if (t.asset_description) parts.push(`Asset: ${t.asset_description}`);
          return parts.join('\n  ');
        })
        .join('\n\n');

      api.logger.info('openclaw-fabric: listing interactions... done');

      const pagination = data.has_more
        ? `\n\nMore interactions available. To see the next page, call this tool again with page_token: "${data.next_page_token}"`
        : '';

      return {
        content: [
          {
            type: 'text' as const,
            text: `Found ${data.items.length} interactions:\n\n${text}${pagination}`,
          },
        ],
        details: {
          interactions,
          has_more: data.has_more,
          next_page_token: data.next_page_token ?? null,
        },
      };
    },
  });
}
