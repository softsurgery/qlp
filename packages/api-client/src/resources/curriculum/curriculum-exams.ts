import type { AxiosInstance } from "axios";
import type {
  CreateCurriculumExamDto,
  QueryParams,
  ResponseCurriculumExamDto,
  ResponseCurriculumExamWorkflowDto,
  ExecuteCurriculumWorkflowDto,
  UpdateCurriculumExamDto,
} from "../../types/index.js";

export function createCurriculumExamsResource(
  http: AxiosInstance,
  basePath: string,
) {
  const create = async (
    moduleId: string,
    dto: CreateCurriculumExamDto,
  ): Promise<ResponseCurriculumExamDto> => {
    const response = await http.post<ResponseCurriculumExamDto>(
      `${basePath}/modules/${moduleId}/exams`,
      dto,
    );
    return response.data;
  };

  const findByModule = async (
    moduleId: string,
    params?: QueryParams,
  ): Promise<ResponseCurriculumExamDto[]> => {
    const response = await http.get<ResponseCurriculumExamDto[]>(
      `${basePath}/modules/${moduleId}/exams`,
      { params },
    );
    return response.data;
  };

  const update = async (
    examId: string,
    dto: UpdateCurriculumExamDto,
  ): Promise<ResponseCurriculumExamDto> => {
    const response = await http.put<ResponseCurriculumExamDto>(
      `${basePath}/exams/${examId}`,
      dto,
    );
    return response.data;
  };

  const remove = async (
    examId: string,
  ): Promise<ResponseCurriculumExamDto | null> => {
    const response = await http.delete<ResponseCurriculumExamDto>(
      `${basePath}/exams/${examId}`,
    );
    return response.data;
  };

  const findVersions = async (
    examId: string,
    params?: QueryParams,
  ): Promise<ResponseCurriculumExamDto[]> => {
    const response = await http.get<ResponseCurriculumExamDto[]>(
      `${basePath}/exams/${examId}/versions`,
      { params },
    );
    return response.data;
  };

  const findWorkflow = async (
    examId: string,
    params?: QueryParams,
  ): Promise<ResponseCurriculumExamWorkflowDto> => {
    const response = await http.get<ResponseCurriculumExamWorkflowDto>(
      `${basePath}/exams/${examId}/workflow`,
      { params },
    );
    return response.data;
  };

  const executeWorkflow = async (
    examId: string,
    dto: ExecuteCurriculumWorkflowDto,
  ): Promise<ResponseCurriculumExamWorkflowDto> => {
    const response = await http.post<ResponseCurriculumExamWorkflowDto>(
      `${basePath}/exams/${examId}/workflow`,
      dto,
    );
    return response.data;
  };

  const reorder = async (
    updates: { id: string; sortOrder: number }[],
  ): Promise<{ success: boolean }> => {
    const response = await http.put<{ success: boolean }>(
      `${basePath}/exams/reorder`,
      { updates },
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
  };
}


export type CurriculumExamsResource = ReturnType<
  typeof createCurriculumExamsResource
>;
