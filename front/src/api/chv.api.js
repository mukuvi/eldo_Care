import api from "./api";

export const submitCase = async (formData) => {
  return api.post("/chv/cases", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const fetchMyCases = async () => {
  return api.get("/chv/cases/me");
};
