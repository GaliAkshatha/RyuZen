import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";

import type { AppApiError } from "@/shared/types/api.types";

/** Same real reasoning as useApiMutation - AppApiError is what actually gets thrown, not the library's default Error. */
export function useApiQuery<TData>(
  options: UseQueryOptions<TData, AppApiError>,
): UseQueryResult<TData, AppApiError> {
  return useQuery(options);
}
