import createClient from 'openapi-fetch';
import type { paths } from './openapi';

const BASE_URL = 'https://api.onfabric.io/api/v1';

type CreateFabricClientOptions = {
  apiKey: string;
};
export type FabricClient = ReturnType<typeof createClient<paths>>;

export function createFabricClient(options: CreateFabricClientOptions): FabricClient {
  const { apiKey } = options;

  return createClient<paths>({
    baseUrl: BASE_URL,
    headers: {
      'X-Api-Key': apiKey,
    },
  });
}
