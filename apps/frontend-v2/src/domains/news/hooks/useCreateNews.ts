import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { newsService } from "@/domains/news/newsService";
import { NEWS_QUERY_KEY } from "@/domains/news/hooks/useNews";
import type { News, CreateNewsRequest } from "@/domains/news/news.types";

export function useCreateNews() {
  const queryClient = useQueryClient();
  return useApiMutation<News, CreateNewsRequest>({
    mutationFn: (payload) => newsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY });
    },
  });
}
