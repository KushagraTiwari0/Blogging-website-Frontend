import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";

const getArticleBySlug = async (slug) => {
  const { data } = await axios.get(
    `https://blogging-website-backend-9gfs.onrender.com/api/articles/${slug}`,
  );

  return data;
};
function useArticleQuery() {
  const { slug } = useParams();

  const {
    isLoading: isArticleLoading,
    data: article,
    error: ArticleError,
  } = useQuery({
    queryKey: ["slugArticle", slug],
    queryFn: () => getArticleBySlug(slug),
    enabled: !!slug,
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
  });
  return {
    isArticleLoading,
    article,
    ArticleError,
  };
}

export default useArticleQuery;
