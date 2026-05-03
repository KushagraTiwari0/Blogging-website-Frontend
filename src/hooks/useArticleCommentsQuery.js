import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../constants";

const getArticleComments = async (slug) => {
  const { data } = await axios.get(
    `${API_BASE_URL}/api/articles/${slug}/comments`,
  );
  return data;
};

function useArticleCommentsQuery() {
  const { slug } = useParams();

  const {
    isLoading: isArticleCommentsLoading,
    data: articleComments,
    error: articleCommentsError,
  } = useQuery({
    queryKey: ["articleComments", slug],
    queryFn: async () => {
      const data = await getArticleComments(slug);
      return data;
    },
    enabled: !!slug,
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
  });
  return {
    isArticleCommentsLoading,
    articleComments,
    articleCommentsError,
  };
}

export default useArticleCommentsQuery;
