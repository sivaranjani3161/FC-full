import type { DbRole } from "./role";

export interface AdminUser {
  id: number;
  email: string;
  name: string | null;
  status: string;
  roleId: number;
  role: DbRole;
}
