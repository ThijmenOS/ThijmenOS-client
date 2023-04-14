import { User } from "@thijmen-os/common";
import api from "./api";

export async function GetAllUsers(): Promise<Array<User>> {
  const { data } = await api.Get("/root/users");
  return data;
}
