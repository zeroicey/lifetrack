import http, { Response } from "@/lib/http";
import ky from "ky";

export const getLinkTitle = async (url: string) => {
  const res = await http.get(`link/title?url=${url}`).json();
  console.log(res);
};
