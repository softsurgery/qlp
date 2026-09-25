import type { AxiosInstance } from "axios";
import type {
  CreateCurriculumExamDto,
  CreateCurriculumModuleDto,
  QueryParams,
  ResponseCurriculumExamDto,
  ResponseCurriculumModuleDto,
  UpdateCurriculumExamDto,
  UpdateCurriculumModuleDto,
  ExecuteCurriculumWorkflowDto,
  ResponseCurriculumModuleWorkflowDto,
} from "../../types/index.js";

export function createCurriculumModulesResource(
  http: AxiosInstance,
  basePath: string,
) {
  const create = async (
    curriculumId: string,
    dto: CreateCurriculumModuleDto,
  ): Promise<ResponseCurriculumModuleDto> => {
    const response = await http.post<ResponseCurriculumModuleDto>(
      `${basePath}/${curriculumId}/modules`,
      dto,
    );
    return response.data;
  };

  const findByCurriculum = async (
    curriculumId: string,
    params?: QueryParams,
  ): Promise<ResponseCurriculumModuleDto[]> => {
    const response = await http.get<ResponseCurriculumModuleDto[]>(
      `${basePath}/${curriculumId}/modules`,
      { params },
    );
    return response.data;
  };

  const update = async (
    moduleId: string,
    dto: UpdateCurriculumModuleDto,
  ): Promise<ResponseCurriculumModuleDto> => {
    const response = await http.put<ResponseCurriculumModuleDto>(
      `${basePath}/modules/${moduleId}`,
      dto,
    );
    return response.data;
  };

  const remove = async (
    moduleId: string,
  ): Promise<ResponseCurriculumModuleDto | null> => {
    const response = await http.delete<ResponseCurriculumModuleDto>(
      `${basePath}/modules/${moduleId}`,
    );
    return response.data;
  };

  const findVersions = async (
    moduleId: string,
    params?: QueryParams,
  ): Promise<ResponseCurriculumModuleDto[]> => {
    const response = await http.get<ResponseCurriculumModuleDto[]>(
      `${basePath}/modules/${moduleId}/versions`,
      { params },
    );
    return response.data;
  };

  const findWorkflow = async (
    moduleId: string,
    params?: QueryParams,
  ): Promise<ResponseCurriculumModuleWorkflowDto> => {
    const response = await http.get<ResponseCurriculumModuleWorkflowDto>(
      `${basePath}/modules/${moduleId}/workflow`,
      { params },
    );
    return response.data;
  };

  const executeWorkflow = async (
    moduleId: string,
    dto: ExecuteCurriculumWorkflowDto,
  ): Promise<ResponseCurriculumModuleWorkflowDto> => {
    const response = await http.post<ResponseCurriculumModuleWorkflowDto>(
      `${basePath}/modules/${moduleId}/workflow`,
      dto,
    );
    return response.data;
  };

  const reorder = async (
    updates: { id: string; sortOrder: number }[],
  ): Promise<{ success: boolean }> => {
    const response = await http.put<{ success: boolean }>(
      `${basePath}/modules/reorder`,
      { updates },
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
    create,
    findByCurriculum,
    update,
    remove,
    findVersions,
    workflow: {
      findWorkflow,
      executeWorkflow,
    },
    reorder,
    createExam,
    updateExam,
    removeExam,
    findExamVersions,
  };
}

export type CurriculumModulesResource = ReturnType<
  typeof createCurriculumModulesResource
>;
