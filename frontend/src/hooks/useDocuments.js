import { useQuery } from "react-query";
import api from "../services/api";

export function useDocuments() {
  return useQuery(
    "documents",
    () => api.get("/documents/my").then((r) => r.data),
    { staleTime: 1000 * 60 * 2 }
  );
}