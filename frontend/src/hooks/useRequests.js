import { useQuery, useMutation, useQueryClient } from "react-query";
import api from "../services/api";

export function useRequests() {
  return useQuery(
    "requests",
    () => api.get("/requests/my").then((r) => r.data),
    { staleTime: 1000 * 60 }
  );
}

export function useSubmitRequest() {
  const queryClient = useQueryClient();
  return useMutation(
    (payload) => api.post("/requests", payload).then((r) => r.data),
    { onSuccess: () => queryClient.invalidateQueries("requests") }
  );
}