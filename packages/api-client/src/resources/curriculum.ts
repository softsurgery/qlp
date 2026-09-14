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
  UpdateCurriculumDto,
  UpdateCurriculumExamDto,
  UpdateCurriculumLessonDto,
  UpdateCurriculumMaterialDto,
  UpdateCurriculumModuleDto,
  ResponseCurriculumWorkflowDto,
  ExecuteCurriculumWorkflowDto,
  ResponseCurriculumModuleWorkflowDto,
  ResponseCurriculumLessonWorkflowDto,
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

  const findModulesByCurriculum = async (
    curriculumId: string,
    params?: QueryParams,
  ): Promise<ResponseCurriculumModuleDto[]> => {
    const response = await http.get<ResponseCurriculumModuleDto[]>(
      `${basePath}/${curriculumId}/modules`,
      { params },
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
    params?: QueryParams,
  ): Promise<ResponseCurriculumModuleDto[]> => {
    const response = await http.get<ResponseCurriculumModuleDto[]>(
      `${basePath}/modules/${moduleId}/versions`,
      { params },
    );
    return response.data;
  };

  const findModuleWorkflow = async (
    moduleId: string,
    params?: QueryParams,
  ): Promise<ResponseCurriculumModuleWorkflowDto> => {
    const response = await http.get<ResponseCurriculumModuleWorkflowDto>(
      `${basePath}/modules/${moduleId}/workflow`,
      { params },
    );
    return response.data;
  };

  const executeModuleWorkflow = async (
    moduleId: string,
    dto: ExecuteCurriculumWorkflowDto,
  ): Promise<ResponseCurriculumModuleWorkflowDto> => {
    const response = await http.post<ResponseCurriculumModuleWorkflowDto>(
      `${basePath}/modules/${moduleId}/workflow`,
      dto,
    );
    return response.data;
  };

  const reorderModules = async (
    updates: { id: string; sortOrder: number }[],
  ): Promise<{ success: boolean }> => {
    const response = await http.put<{ success: boolean }>(
      `${basePath}/modules/reorder`,
      { updates },
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

  const findLessonsByModule = async (
    moduleId: string,
    params?: QueryParams,
  ): Promise<ResponseCurriculumLessonDto[]> => {
    const response = await http.get<ResponseCurriculumLessonDto[]>(
      `${basePath}/modules/${moduleId}/lessons`,
      { params },
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
    params?: QueryParams,
  ): Promise<ResponseCurriculumLessonDto[]> => {
    const response = await http.get<ResponseCurriculumLessonDto[]>(
      `${basePath}/lessons/${lessonId}/versions`,
      { params },
    );
    return response.data;
  };

  const findLessonWorkflow = async (
    lessonId: string,
    params?: QueryParams,
  ): Promise<ResponseCurriculumLessonWorkflowDto> => {
    const response = await http.get<ResponseCurriculumLessonWorkflowDto>(
      `${basePath}/lessons/${lessonId}/workflow`,
      { params },
    );
    return response.data;
  };

  const executeLessonWorkflow = async (
    lessonId: string,
    dto: ExecuteCurriculumWorkflowDto,
  ): Promise<ResponseCurriculumLessonWorkflowDto> => {
    const response = await http.post<ResponseCurriculumLessonWorkflowDto>(
      `${basePath}/lessons/${lessonId}/workflow`,
      dto,
    );
    return response.data;
  };

  const reorderLessons = async (
    updates: { id: string; sortOrder: number }[],
  ): Promise<{ success: boolean }> => {
    const response = await http.put<{ success: boolean }>(
      `${basePath}/lessons/reorder`,
      { updates },
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
    findVersions,
    workflow: {
      findWorkflow,
      executeWorkflow,
    },
    create,
    update,
    remove,
    createModule,
    findModulesByCurriculum,
    updateModule,
    removeModule,
    findModuleVersions,
    findModuleWorkflow,
    executeModuleWorkflow,
    reorderModules,
    findLessonsByModule,
    createLesson,
    updateLesson,
    removeLesson,
    findLessonVersions,
    findLessonWorkflow,
    executeLessonWorkflow,
    reorderLessons,
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
