import type { AxiosInstance } from "axios";
import type {
  CreateCurriculumLessonDto,
  CreateCurriculumMaterialDto,
  QueryParams,
  ResponseCurriculumLessonDto,
  ResponseCurriculumLessonMaterialDto,
  UpdateCurriculumLessonDto,
  UpdateCurriculumMaterialDto,
  ExecuteCurriculumWorkflowDto,
  ResponseCurriculumLessonWorkflowDto,
} from "../../types/index.js";

export function createCurriculumLessonsResource(
  http: AxiosInstance,
  basePath: string,
) {
  const create = async (
    moduleId: string,
    dto: CreateCurriculumLessonDto,
  ): Promise<ResponseCurriculumLessonDto> => {
    const response = await http.post<ResponseCurriculumLessonDto>(
      `${basePath}/modules/${moduleId}/lessons`,
      dto,
    );
    return response.data;
  };

  const findByModule = async (
    moduleId: string,
    params?: QueryParams,
  ): Promise<ResponseCurriculumLessonDto[]> => {
    const response = await http.get<ResponseCurriculumLessonDto[]>(
      `${basePath}/modules/${moduleId}/lessons`,
      { params },
    );
    return response.data;
  };

  const update = async (
    lessonId: string,
    dto: UpdateCurriculumLessonDto,
  ): Promise<ResponseCurriculumLessonDto> => {
    const response = await http.put<ResponseCurriculumLessonDto>(
      `${basePath}/lessons/${lessonId}`,
      dto,
    );
    return response.data;
  };

  const remove = async (
    lessonId: string,
  ): Promise<ResponseCurriculumLessonDto | null> => {
    const response = await http.delete<ResponseCurriculumLessonDto>(
      `${basePath}/lessons/${lessonId}`,
    );
    return response.data;
  };

  const findVersions = async (
    lessonId: string,
    params?: QueryParams,
  ): Promise<ResponseCurriculumLessonDto[]> => {
    const response = await http.get<ResponseCurriculumLessonDto[]>(
      `${basePath}/lessons/${lessonId}/versions`,
      { params },
    );
    return response.data;
  };

  const findWorkflow = async (
    lessonId: string,
    params?: QueryParams,
  ): Promise<ResponseCurriculumLessonWorkflowDto> => {
    const response = await http.get<ResponseCurriculumLessonWorkflowDto>(
      `${basePath}/lessons/${lessonId}/workflow`,
      { params },
    );
    return response.data;
  };

  const executeWorkflow = async (
    lessonId: string,
    dto: ExecuteCurriculumWorkflowDto,
  ): Promise<ResponseCurriculumLessonWorkflowDto> => {
    const response = await http.post<ResponseCurriculumLessonWorkflowDto>(
      `${basePath}/lessons/${lessonId}/workflow`,
      dto,
    );
    return response.data;
  };

  const reorder = async (
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

  return {
    create,
    findByModule,
    update,
    remove,
    findVersions,
    workflow: {
      findWorkflow,
      executeWorkflow,
    },
    reorder,
    createMaterial,
    updateMaterial,
    removeMaterial,
    findMaterialVersions,
  };
}

export type CurriculumLessonsResource = ReturnType<
  typeof createCurriculumLessonsResource
>;
