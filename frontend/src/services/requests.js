import api from "./api";

export const getMyRequests    = ()        => api.get("/requests/my").then((r) => r.data);
export const getAllRequests    = (status)  => api.get(`/requests${status ? `?status=${status}` : ""}`).then((r) => r.data);
export const getRequest       = (id)      => api.get(`/requests/${id}`).then((r) => r.data);
export const createRequest    = (payload) => api.post("/requests", payload).then((r) => r.data);
export const decideRequest    = (id, payload) => api.post(`/requests/${id}/decide`, payload).then((r) => r.data);