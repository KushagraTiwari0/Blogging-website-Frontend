import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../constants";

const getAllTags = async () => {
  const { data } = await axios.get(
    `${API_BASE_URL}/api/tags`,
  );

  //   console.log("getCurrentUser", { data });

  return data;
};

function useTagsQuery() {
  const {
    isLoading: isTagsLoading,
    data: tags,
    error: tagsError,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: getAllTags,
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
  });
  return {
    isTagsLoading,
    tags,
    tagsError,
  };
}

export default useTagsQuery;
