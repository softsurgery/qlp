import type { AxiosInstance } from "axios";
import type {
  CreateCurriculumDto,
  Paginated,
  QueryParams,
  ResponseCurriculumDto,
  UpdateCurriculumDto,
  ResponseCurriculumWorkflowDto,
  ExecuteCurriculumWorkflowDto,
} from "../../types/index.js";

export function createCurriculumResource(
  http: AxiosInstance,
  basePath: string,
) {
  const findPaginated = async ({
    page = "1",
    limit = "12",
    sort,
    filter = "",
    search = "",
    join,
  }: QueryParams): Promise<Paginated<ResponseCurriculumDto>> => {
    const params: { [key: string]: string | undefined } = { page, limit, sort };
    if (search) params.search = search;
    if (filter) params.filter = filter;
    if (join) params.join = join;
    const response = await http.get<Paginated<ResponseCurriculumDto>>(
      `${basePath}/list`,
      { params },
    );
    return response.data;
  };

  const findAll = async (): Promise<ResponseCurriculumDto[]> => {
    const response = await http.get<ResponseCurriculumDto[]>(`${basePath}/all`);
    return response.data;
  };

  const findById = async (
    id: string,
    params?: QueryParams,
  ): Promise<ResponseCurriculumDto> => {
    const response = await http.get<ResponseCurriculumDto>(
      `${basePath}/${id}`,
      { params },
    );
    return response.data;
  };

  const findVersions = async (
    id: string,
    params?: QueryParams,
  ): Promise<Paginated<ResponseCurriculumDto>> => {
    const response = await http.get<Paginated<ResponseCurriculumDto>>(
      `${basePath}/${id}/versions`,
      { params },
    );
    return response.data;
  };

  const findWorkflow = async (
    id: string,
    params?: QueryParams,
  ): Promise<ResponseCurriculumWorkflowDto> => {
    const response = await http.get<ResponseCurriculumWorkflowDto>(
      `${basePath}/${id}/workflow`,
      { params },
    );
    return response.data;
  };

  const executeWorkflow = async (
    id: string,
    dto: ExecuteCurriculumWorkflowDto,
  ): Promise<ResponseCurriculumWorkflowDto> => {
    const response = await http.post<ResponseCurriculumWorkflowDto>(
      `${basePath}/${id}/workflow`,
      dto,
    );
    return response.data;
  };

  const create = async (
    dto: CreateCurriculumDto,
  ): Promise<ResponseCurriculumDto> => {
    const response = await http.post<ResponseCurriculumDto>(basePath, dto);
    return response.data;
  };

  const update = async (
    id: string,
    dto: UpdateCurriculumDto,
  ): Promise<ResponseCurriculumDto> => {
    const response = await http.put<ResponseCurriculumDto>(
      `${basePath}/${id}`,
      dto,
    );
    return response.data;
  };

  const remove = async (id: string): Promise<ResponseCurriculumDto | null> => {
    const response = await http.delete<ResponseCurriculumDto>(
      `${basePath}/${id}`,
    );
    return response.data;
  };

  return {
    findPaginated,
    findAll,
    findById,
    findVersions,
    workflow: {
      findWorkflow,
      executeWorkflow,
    },
    create,
    update,
    remove,
  };
}

export type CurriculumResource = ReturnType<typeof createCurriculumResource>;
