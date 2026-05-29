import { createOpraHooks } from '@opra-frontend/react-service-toolkit/react-query';
import type { ApiType } from '../api/instance';

export const {
  useApiQuery,
  useApiMutation,
  useApiPaginatedQuery,
  useApiInfiniteQuery,
} = createOpraHooks<ApiType>();
