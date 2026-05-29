import { createOpraHooks } from '@opra-frontend/react-toolkit/react-query';
import type { ApiType } from '../api/instance';

export const {
  useApiQuery,
  useApiMutation,
  useApiPaginatedQuery,
  useApiInfiniteQuery,
} = createOpraHooks<ApiType>();
