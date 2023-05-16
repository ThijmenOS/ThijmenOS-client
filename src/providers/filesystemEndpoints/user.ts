import { User } from "@thijmen-os/common";
import api from "./api";

export async function UpdateUser(user: User): Promise<User> {
  const { data } = await api.Post("/settings/user", user);
  console.log(data);
  return data;
}
