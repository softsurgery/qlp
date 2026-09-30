import type { AxiosInstance } from "axios";
import type {
  CreateRoleDto,
  Paginated,
  QueryParams,
  ResponseRoleDto,
  UpdateRoleDto,
} from "../types/index.js";

export function createRoleResource(http: AxiosInstance) {
  const findPaginated = async ({
    page = "1",
    limit = "5",
    sort,
    search = "",
    filter = "",
    join = "permissions.permission",
  }: QueryParams): Promise<Paginated<ResponseRoleDto>> => {
    const params: { [key: string]: string | undefined } = {
      page,
      limit,
      sort,
    };

    if (search) params.search = search;
    if (filter) params.filter = filter;
    if (join) params.join = join;

    const response = await http.get<Paginated<ResponseRoleDto>>(
      `/admin/role/list`,
      { params },
    );

    return response.data;
  };

  const findAll = async (): Promise<ResponseRoleDto[]> => {
    const response = await http.get<ResponseRoleDto[]>(`/admin/role/all`);
    return response.data;
  };

  const findById = async (id: string): Promise<ResponseRoleDto> => {
    const response = await http.get<ResponseRoleDto>(`/admin/role/${id}`);
    return response.data;
  };

  const create = async (role: CreateRoleDto): Promise<ResponseRoleDto> => {
    const response = await http.post("/admin/role", role);
    return response.data;
  };

  const update = async (
    id?: string,
    role?: UpdateRoleDto,
  ): Promise<ResponseRoleDto> => {
    const response = await http.put(`/admin/role/${id}`, role);
    return response.data;
  };

  const duplicate = async (id?: string): Promise<ResponseRoleDto> => {
    const response = await http.post(`/admin/role/duplicate/${id}`);
    return response.data;
  };

  const remove = async (id?: string): Promise<ResponseRoleDto> => {
    const response = await http.delete(`/admin/role/${id}`);
    return response.data;
  };

  return {
    findPaginated,
    findAll,
    findById,
    create,
    update,
    duplicate,
    remove,
  };
}

export type RoleResource = ReturnType<typeof createRoleResource>;
