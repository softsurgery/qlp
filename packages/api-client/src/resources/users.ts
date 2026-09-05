import type { AxiosInstance } from "axios";
import type {
  CreateUserDto,
  Paginated,
  QueryParams,
  ResponseUserDto,
  UpdateUserDto,
} from "../types/index.js";

export function createUserResource(http: AxiosInstance) {
  const findPaginated = async ({
    page = "1",
    limit = "5",
    sort,
    filter = "",
    search = "",
  }: QueryParams): Promise<Paginated<ResponseUserDto>> => {
    const params: { [key: string]: string | undefined } = {
      page,
      limit,
      sort,
    };

    if (search) params.search = search;
    if (filter) params.filter = filter;

    const response = await http.get<Paginated<ResponseUserDto>>(
      `/admin/user/list`,
      { params },
    );

    return response.data;
  };

  const activate = async (id?: string): Promise<ResponseUserDto> => {
    const response = await http.put(`/admin/user/activate/${id}`);
    return response.data;
  };

  const deactivate = async (id?: string): Promise<ResponseUserDto> => {
    const response = await http.put(`/admin/user/deactivate/${id}`);
    return response.data;
  };

  const approve = async (id?: string): Promise<ResponseUserDto> => {
    const response = await http.put(`/admin/user/approve/${id}`);
    return response.data;
  };

  const disapprove = async (id?: string): Promise<ResponseUserDto> => {
    const response = await http.put(`/admin/user/disapprove/${id}`);
    return response.data;
  };

  const findAll = async (): Promise<ResponseUserDto[]> => {
    const response = await http.get<ResponseUserDto[]>(`/admin/user/all`);
    return response.data;
  };

  const findById = async (
    userId?: string,
    join?: string,
  ): Promise<ResponseUserDto> => {
    const response = await http.get<ResponseUserDto>(`/admin/user/${userId}`, {
      params: { join },
    });
    return response.data;
  };

  const findByEmail = async (
    email?: string,
    join?: string,
  ): Promise<ResponseUserDto> => {
    const response = await http.get<ResponseUserDto>(
      `/admin/user/email/${email}`,
      { params: { join } },
    );
    return response.data;
  };

  const create = async (user: CreateUserDto): Promise<ResponseUserDto> => {
    const response = await http.post("/admin/user", user);
    return response.data;
  };

  const update = async (
    id?: string,
    user?: UpdateUserDto,
  ): Promise<ResponseUserDto> => {
    const response = await http.put(`/admin/user/${id}`, user);
    return response.data;
  };

  const remove = async (userId?: string): Promise<ResponseUserDto> => {
    const response = await http.delete(`/admin/user/${userId}`);
    return response.data;
  };

  return {
    findPaginated,
    findAll,
    findById,
    findByEmail,
    create,
    update,
    activate,
    deactivate,
    approve,
    disapprove,
    remove,
  };
}

export type UserResource = ReturnType<typeof createUserResource>;
