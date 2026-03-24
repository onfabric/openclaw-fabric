import { Type } from '@sinclair/typebox';
import type { OpenClawPluginApi } from 'openclaw/plugin-sdk/plugin-entry';
import type { FabricClient } from '../api/client';
import { PageSortDirection } from '../api/openapi';
import { registerTool } from '../lib/register-tool';

const ListThreadsToolParametersSchema = Type.Object({
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
  page_size: Type.Optional(
    Type.Integer({
      description: 'Number of interactions to return per page.',
      minimum: 1,
      maximum: 100,
    }),
  ),
  direction: Type.Optional(
    Type.Enum(PageSortDirection, {
      description: 'Sort direction: "asc" (oldest first) or "desc" (newest first, default).',
    }),
  ),
  page_token: Type.Optional(
    Type.String({
      description:
        "Opaque pagination cursor from a previous response's next_page_token. Omit for the first page.",
    }),
  ),
});

export function registerListThreadsTool(
  api: OpenClawPluginApi,
  client: FabricClient,
  userId: string,
): void {
  registerTool(api, {
    name: 'fabric_list_interactions',
    label: 'List Fabric Interactions',
    description: "List the user's interactions on various digital platforms.",
    parameters: ListThreadsToolParametersSchema,
    async execute(_id, params) {
      api.logger.info('openclaw-fabric: listing threads...');

      const { data, error } = await client.GET('/users/{user_id}/threads', {
        params: {
          path: { user_id: userId },
          query: {
            interaction_type: params.interaction_type ?? null,
            from_date: params.from_date ?? null,
            to_date: params.to_date ?? null,
            page_size: params.page_size,
            direction: params.direction ?? null,
            page_token: params.page_token ?? null,
          },
        },
      });

      if (error) {
        return {
          content: [{ type: 'text', text: `Error fetching threads: ${JSON.stringify(error)}` }],
          details: error,
        };
      }

      const text = data.items
        .map((item, i) => {
          const parts = [
            `${i + 1}. [${item.interaction_type ?? 'unknown'}] ${item.provider}`,
          ];
          if (item.asat) parts.push(`  Date: ${item.asat}`);
          if (item.preview) parts.push(`  Preview: ${item.preview}`);
          if (item.asset_description) parts.push(`  Asset Description: ${item.asset_description}`);
          return parts.join('\n');
        })
        .join('\n\n');

      const result = {
        threads: data.items,
        has_more: data.has_more,
        next_page_token: data.next_page_token ?? null,
      };

      api.logger.info('openclaw-fabric: listing threads... done');

      return {
        content: [
          {
            type: 'text' as const,
            text: `Found ${data.items.length} interactions${data.has_more ? ' (more available)' : ''}:\n\n${text}`,
          },
        ],
        details: result,
      };
    },
  });
}
