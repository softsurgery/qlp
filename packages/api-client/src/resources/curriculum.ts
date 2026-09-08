import type { AxiosInstance } from "axios";
import type {
  CreateCurriculumDto,
  CreateCurriculumExamDto,
  CreateCurriculumLessonDto,
  CreateCurriculumMaterialDto,
  CreateCurriculumModuleDto,
  Paginated,
  QueryParams,
  ResponseCurriculumDto,
  ResponseCurriculumExamDto,
  ResponseCurriculumLessonDto,
  ResponseCurriculumLessonMaterialDto,
  ResponseCurriculumModuleDto,
  ResponseCurriculumTreeDto,
  UpdateCurriculumDto,
  UpdateCurriculumExamDto,
  UpdateCurriculumLessonDto,
  UpdateCurriculumMaterialDto,
  UpdateCurriculumModuleDto,
} from "../types/index.js";

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
  }: QueryParams): Promise<Paginated<ResponseCurriculumDto>> => {
    const params: { [key: string]: string | undefined } = { page, limit, sort };
    if (search) params.search = search;
    if (filter) params.filter = filter;
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

  const findById = async (id: string): Promise<ResponseCurriculumDto> => {
    const response = await http.get<ResponseCurriculumDto>(`${basePath}/${id}`);
    return response.data;
  };

  const findTree = async (
    id: string,
    version?: number,
  ): Promise<ResponseCurriculumTreeDto> => {
    const response = await http.get<ResponseCurriculumTreeDto>(
      `${basePath}/${id}/tree`,
      { params: version != null ? { version } : undefined },
    );
    return response.data;
  };

  const findVersions = async (id: string): Promise<ResponseCurriculumDto[]> => {
    const response = await http.get<ResponseCurriculumDto[]>(
      `${basePath}/${id}/versions`,
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

  const createModule = async (
    curriculumId: string,
    dto: CreateCurriculumModuleDto,
  ): Promise<ResponseCurriculumModuleDto> => {
    const response = await http.post<ResponseCurriculumModuleDto>(
      `${basePath}/${curriculumId}/modules`,
      dto,
    );
    return response.data;
  };

  const updateModule = async (
    moduleId: string,
    dto: UpdateCurriculumModuleDto,
  ): Promise<ResponseCurriculumModuleDto> => {
    const response = await http.put<ResponseCurriculumModuleDto>(
      `${basePath}/modules/${moduleId}`,
      dto,
    );
    return response.data;
  };

  const removeModule = async (
    moduleId: string,
  ): Promise<ResponseCurriculumModuleDto | null> => {
    const response = await http.delete<ResponseCurriculumModuleDto>(
      `${basePath}/modules/${moduleId}`,
    );
    return response.data;
  };

  const findModuleVersions = async (
    moduleId: string,
  ): Promise<ResponseCurriculumModuleDto[]> => {
    const response = await http.get<ResponseCurriculumModuleDto[]>(
      `${basePath}/modules/${moduleId}/versions`,
    );
    return response.data;
  };

  const createLesson = async (
    moduleId: string,
    dto: CreateCurriculumLessonDto,
  ): Promise<ResponseCurriculumLessonDto> => {
    const response = await http.post<ResponseCurriculumLessonDto>(
      `${basePath}/modules/${moduleId}/lessons`,
      dto,
    );
    return response.data;
  };

  const updateLesson = async (
    lessonId: string,
    dto: UpdateCurriculumLessonDto,
  ): Promise<ResponseCurriculumLessonDto> => {
    const response = await http.put<ResponseCurriculumLessonDto>(
      `${basePath}/lessons/${lessonId}`,
      dto,
    );
    return response.data;
  };

  const removeLesson = async (
    lessonId: string,
  ): Promise<ResponseCurriculumLessonDto | null> => {
    const response = await http.delete<ResponseCurriculumLessonDto>(
      `${basePath}/lessons/${lessonId}`,
    );
    return response.data;
  };

  const findLessonVersions = async (
    lessonId: string,
  ): Promise<ResponseCurriculumLessonDto[]> => {
    const response = await http.get<ResponseCurriculumLessonDto[]>(
      `${basePath}/lessons/${lessonId}/versions`,
    );
    return response.data;
  };

  const createMaterial = async (
    lessonId: string,
    dto: CreateCurriculumMaterialDto,
  ): Promise<ResponseCurriculumLessonMaterialDto> => {
    const response = await http.post<ResponseCurriculumLessonMaterialDto>(
      `${basePath}/lessons/${lessonId}/materials`,
      dto,
    );
    return response.data;
  };

  const updateMaterial = async (
    materialId: string,
    dto: UpdateCurriculumMaterialDto,
  ): Promise<ResponseCurriculumLessonMaterialDto> => {
    const response = await http.put<ResponseCurriculumLessonMaterialDto>(
      `${basePath}/materials/${materialId}`,
      dto,
    );
    return response.data;
  };

  const removeMaterial = async (
    materialId: string,
  ): Promise<ResponseCurriculumLessonMaterialDto | null> => {
    const response = await http.delete<ResponseCurriculumLessonMaterialDto>(
      `${basePath}/materials/${materialId}`,
    );
    return response.data;
  };

  const findMaterialVersions = async (
    materialId: string,
  ): Promise<ResponseCurriculumLessonMaterialDto[]> => {
    const response = await http.get<ResponseCurriculumLessonMaterialDto[]>(
      `${basePath}/materials/${materialId}/versions`,
    );
    return response.data;
  };

  const createExam = async (
    moduleId: string,
    dto: CreateCurriculumExamDto,
  ): Promise<ResponseCurriculumExamDto> => {
    const response = await http.post<ResponseCurriculumExamDto>(
      `${basePath}/modules/${moduleId}/exams`,
      dto,
    );
    return response.data;
  };

  const updateExam = async (
    examId: string,
    dto: UpdateCurriculumExamDto,
  ): Promise<ResponseCurriculumExamDto> => {
    const response = await http.put<ResponseCurriculumExamDto>(
      `${basePath}/exams/${examId}`,
      dto,
    );
    return response.data;
  };

  const removeExam = async (
    examId: string,
  ): Promise<ResponseCurriculumExamDto | null> => {
    const response = await http.delete<ResponseCurriculumExamDto>(
      `${basePath}/exams/${examId}`,
    );
    return response.data;
  };

  const findExamVersions = async (
    examId: string,
  ): Promise<ResponseCurriculumExamDto[]> => {
    const response = await http.get<ResponseCurriculumExamDto[]>(
      `${basePath}/exams/${examId}/versions`,
    );
    return response.data;
  };

  return {
    findPaginated,
    findAll,
    findById,
    findTree,
    findVersions,
    create,
    update,
    remove,
    createModule,
    updateModule,
    removeModule,
    findModuleVersions,
    createLesson,
    updateLesson,
    removeLesson,
    findLessonVersions,
    createMaterial,
    updateMaterial,
    removeMaterial,
    findMaterialVersions,
    createExam,
    updateExam,
    removeExam,
    findExamVersions,
  };
}

export type CurriculumResource = ReturnType<typeof createCurriculumResource>;
