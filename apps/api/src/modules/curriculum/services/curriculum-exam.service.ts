import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { AbstractVersioningCrudService } from 'src/shared/database/services/abstract-versioning-crud.service';
import { CurriculumExamEntity, ExamQuestion } from '../entities/curriculum-exam.entity';
import { CurriculumExamRepository } from '../repositories/curriculum-exam.repository';
import { CreateCurriculumExamDto } from '../dtos/exam/create-curriculum-exam.dto';
import { UpdateCurriculumExamDto } from '../dtos/exam/update-curriculum-exam.dto';
import { ExamQuestionDto } from '../dtos/exam/exam-question.dto';

@Injectable()
export class CurriculumExamService extends AbstractVersioningCrudService<CurriculumExamEntity> {
  constructor(private readonly examRepository: CurriculumExamRepository) {
    super(examRepository);
  }

  private normalizeQuestions(questions?: ExamQuestionDto[]): ExamQuestion[] {
    return (questions ?? []).map((question) => ({
      id: question.id || randomUUID(),
      prompt: question.prompt,
      type: question.type,
      options: question.options,
      answer: question.answer,
      points: question.points ?? 1,
    }));
  }

  async createForModule(moduleId: string, dto: CreateCurriculumExamDto) {
    const siblings = await this.findAll({ filter: `moduleId||$eq||${moduleId}` });
    return this.save({
      moduleId,
      title: dto.title,
      description: dto.description,
      durationMinutes: dto.durationMinutes,
      passingScore: dto.passingScore ?? 0,
      questions: this.normalizeQuestions(dto.questions),
      sortOrder: dto.sortOrder ?? siblings.length,
    });
  }

  async updateExam(id: string, dto: UpdateCurriculumExamDto) {
    return this.update(id, {
      title: dto.title,
      description: dto.description,
      durationMinutes: dto.durationMinutes,
      passingScore: dto.passingScore,
      sortOrder: dto.sortOrder,
      ...(dto.questions ? { questions: this.normalizeQuestions(dto.questions) } : {}),
    });
  }

  async findLatestByModule(moduleId: string) {
    return this.findAll({
      filter: `moduleId||$eq||${moduleId}`,
      sort: 'sortOrder',
    });
  }
}
