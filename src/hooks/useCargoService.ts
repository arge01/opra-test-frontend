import { createOpraHooks } from '@opra-frontend/react-service-toolkit/react-query';
import type { cargoApi } from '../api/instance';

export const {
  useApiQuery: useCargoQuery,
  useApiMutation: useCargoMutation,
  useApiPaginatedQuery: useCargoPaginatedQuery,
  useApiInfiniteQuery: useCargoInfiniteQuery,
} = createOpraHooks<typeof cargoApi>();
