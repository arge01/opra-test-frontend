import { createOpraHooks } from '@opra-frontend/react-service-toolkit/react-query';
import type { productApi } from '../api/instance';

export const {
  useApiQuery: useProductQuery,
  useApiMutation: useProductMutation,
  useApiPaginatedQuery: useProductPaginatedQuery,
  useApiInfiniteQuery: useProductInfiniteQuery,
} = createOpraHooks<typeof productApi>();
