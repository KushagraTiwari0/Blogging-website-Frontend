import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../constants";

const getCurrentUser = async () => {
  const { data } = await axios.get(
    `${API_BASE_URL}/api/user`,
  );

  //   console.log("getCurrentUser", { data });

  return data;
};

function useUserQuery() {
  const {
    isLoading: isCurrentUserLoading,
    data: currentUser,
    error: currentUserError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
  });
  return {
    isCurrentUserLoading,
    currentUser,
    currentUserError,
  };
}

export default useUserQuery;
