import { Accounts } from "@thijmen-os/common";
import api from "./api";

export async function GetAllUsers(): Promise<Accounts> {
  const { data } = await api.Get<Accounts>("/root/users");
  return data;
}
