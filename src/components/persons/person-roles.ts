import { Role } from "@/types";

export const personRoles = Object.entries(Role).map(([key, label]) => ({
  value: key,
  label,
}));
