import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../constants";

const getAllArticles = async (filters) => {
  // Use /feed only when the user is logged-in and wants their feed
  const url = filters?.feed
    ? `${API_BASE_URL}/api/articles/feed`
    : `${API_BASE_URL}/api/articles`;

  const params = {
    limit: filters?.limit || 10,
    offset: filters?.offset || 0,
  };
  if (filters?.tag) params.tag = filters.tag;
  if (filters?.author) params.author = filters.author;
  if (filters?.favorited) params.favorited = filters.favorited;

  const { data } = await axios.get(url, { params });

  return data;
};

function useArticlesQuery(filters) {
  const {
    isLoading: isArticlesLoading,
    data: articles,
    error: ArticlesError,
  } = useQuery({
    queryKey: ["articles", filters],
    queryFn: () => getAllArticles(filters),
    refetchOnWindowFocus: false, // Reduced aggressiveness
    staleTime: 300000, // 5 minutes
    gcTime: 600000, // 10 minutes (replaces cacheTime in newer React Query)
  });
  return {
    isArticlesLoading,
    articles,
    ArticlesError,
  };
}

export default useArticlesQuery;
