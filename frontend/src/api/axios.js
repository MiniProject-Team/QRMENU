import axios from "axios";

const API = axios.create({
  baseURL: "https://qrmenu-2a58.onrender.com/api",
});

// attach JWT only if needed
API.interceptors.request.use((req) => {
  // const token = localStorage.getItem("token");

  // // ❗ Only attach token for protected APIs
  // if (token && !req.url.includes("/user/menu")) {
  //   req.headers.Authorization = `Bearer ${token}`;
  // }

  return req;
});

export default API;