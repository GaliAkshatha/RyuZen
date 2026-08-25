import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { newsService } from "@/domains/news/newsService";
import { NEWS_QUERY_KEY } from "@/domains/news/hooks/useNews";

export function useDeleteNews() {
  const queryClient = useQueryClient();
  return useApiMutation<void, string>({
    mutationFn: (id) => newsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY });
    },
  });
}
