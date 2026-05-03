import React from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../constants";

const updateArticleRequest = async ({ slug, values }) => {
  const { data } = await axios.put(
    `${API_BASE_URL}/api/articles/${slug}`,
    { article: { ...values } },
  );

  return data;
};

export default function useUpdateArticle() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: updateArticle,
    isLoading: isUpdating,
  } = useMutation({
    mutationFn: updateArticleRequest,
    onSuccess: (data) => {
      alert("Post successfully updated");
      queryClient.invalidateQueries({
        queryKey: ["articles"],
      });
      navigate(`/article/${data.article.slug}`);
    },
    onError: (err) => alert(err.message),
  });

  return { isUpdating, updateArticle };
}
