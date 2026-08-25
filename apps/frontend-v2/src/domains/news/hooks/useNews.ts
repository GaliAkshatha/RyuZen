import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { newsService } from "@/domains/news/newsService";
import type { News } from "@/domains/news/news.types";

export const NEWS_QUERY_KEY = ["news"] as const;

export function useNews() {
  return useApiQuery<News[]>({ queryKey: NEWS_QUERY_KEY, queryFn: newsService.list });
}
