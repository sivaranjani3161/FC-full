export type DbRole = {
  id: number;
  name: string;
  code: string;
  description?: string | null;
};

export type Permission = {
  id: number;
  code: string;
  name: string;
  roleId?: number;
};

export type PermMap = Record<string, Record<string, boolean>>;
