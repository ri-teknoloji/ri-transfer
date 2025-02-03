import axios from "axios";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5173",
});

export const getFile = (url: string) => {
  return process.env.NEXT_PUBLIC_CDN_URL + "/" + encodeURIComponent(url);
};

export default http;
