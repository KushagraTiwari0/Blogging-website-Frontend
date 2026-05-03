import React from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../constants";

const createCommentApi = async (values) => {
  const { data } = await axios.post(
    `${API_BASE_URL}/api/articles/${values.slug}/comments`,
    { ...values.values },
  );

  return data;
};

export default function useCreateComment() {
  const queryClient = useQueryClient();

  const {
    mutate: createComment,
    isLoading: isCreatingComment,
  } = useMutation({
    mutationFn: createCommentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["articleComments"],
      });
    },
    onError: (err) => alert(err.message),
  });

  return { isCreatingComment, createComment };
}
