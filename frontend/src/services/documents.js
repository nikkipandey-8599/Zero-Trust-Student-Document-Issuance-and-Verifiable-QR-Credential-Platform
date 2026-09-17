import api from "./api";

export const getMyDocuments = () =>
  api.get("/documents/my").then((r) => r.data);

export const getDocument = (id) =>
  api.get(`/documents/${id}`).then((r) => r.data);

export const downloadDocument = (id) =>
  api.get(`/documents/${id}/download`, { responseType: "blob" }).then((r) => r.data);