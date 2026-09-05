import type { AxiosInstance } from "axios";
import type { ResponsePermissionDto } from "../types/index.js";

export function createPermissionResource(http: AxiosInstance) {
  const findAll = async (): Promise<ResponsePermissionDto[]> => {
    const response = await http.get<ResponsePermissionDto[]>(
      `/admin/permission/all`,
    );
    return response.data;
  };

  const findById = async (id: string): Promise<ResponsePermissionDto> => {
    const response = await http.get<ResponsePermissionDto>(
      `/admin/permission/${id}`,
    );
    return response.data;
  };

  return {
    findAll,
    findById,
  };
}

export type PermissionResource = ReturnType<typeof createPermissionResource>;
