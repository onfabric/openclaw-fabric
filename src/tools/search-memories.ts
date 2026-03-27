import { Type } from '@sinclair/typebox';
import type { OpenClawPluginApi } from 'openclaw/plugin-sdk/plugin-entry';
import type { FabricClient } from '../api/client';
import { PageSortDirection } from '../api/openapi';
import { registerTool } from '../lib/register-tool';

const DEFAULT_PAGE_SIZE = 20;

const SearchMemoriesToolParametersSchema = Type.Object({
  query: Type.Optional(
    Type.String({
      description: 'Search query to filter memories by content.',
    }),
  ),
  from_date: Type.Optional(
    Type.String({
      description: 'Only return memories from this date onwards (ISO 8601 format).',
    }),
  ),
  to_date: Type.Optional(
    Type.String({
      description: 'Only return memories up to this date (ISO 8601 format).',
    }),
  ),
  direction: Type.Optional(
    Type.Enum(PageSortDirection, {
      description: 'Sort direction: "asc" (oldest first) or "desc" (newest first, default).',
    }),
  ),
  page_size: Type.Optional(
    Type.Number({
      description: 'Number of memories to return per page.',
      minimum: 1,
      maximum: 100,
      default: DEFAULT_PAGE_SIZE,
    }),
  ),
  page_token: Type.Optional(
    Type.String({
      description: 'Token to continue searching memories from a previous page.',
    }),
  ),
});

export function registerSearchMemoriesTool(
  api: OpenClawPluginApi,
  client: FabricClient,
  userId: string,
): void {
  registerTool(api, {
    name: 'fabric_search_memories',
    label: 'Search Fabric Memories',
    description:
      "Retrieves episodic memories derived from the user's interactions. " +
      'Each memory summarises what the user was doing during a specific period of time. ' +
      'Memories are not a profile of the user as a whole — they are snapshots. ' +
      'To understand the user more broadly, look for patterns across several memories.',
    parameters: SearchMemoriesToolParametersSchema,
    async execute(_id, params) {
      api.logger.info('openclaw-fabric: searching memories...');

      const { data, error } = await client.GET('/users/{user_id}/memories', {
        params: {
          path: { user_id: userId },
          query: {
            query: params.query ?? null,
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
          content: [{ type: 'text', text: `Error fetching memories: ${JSON.stringify(error)}` }],
          details: error,
        };
      }

      api.logger.info(
        `openclaw-fabric: searching memories... done. Found ${data.items.length} memories${data.has_more ? ' (more available)' : ''}`,
      );

      const text = data.items
        .map((item, i) => {
          const dates =
            item.from_date || item.to_date
              ? ` [${item.from_date ?? '?'} - ${item.to_date ?? '?'}]`
              : '';
          return `${i + 1}. ${item.content}${dates}`;
        })
        .join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `Found ${data.items.length} memories${data.has_more ? ' (more available)' : ''}:\n\n${text}`,
          },
        ],
        details: {
          memories: data.items,
          has_more: data.has_more,
          next_page_token: data.next_page_token ?? null,
        },
      };
    },
  });
}
