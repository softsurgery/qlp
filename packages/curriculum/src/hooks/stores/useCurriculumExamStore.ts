import { create } from "zustand";
import { setNestedValue } from "@qlp/lib";
import type {
  ResponseCurriculumExamDto,
  CreateCurriculumExamDto,
  UpdateCurriculumExamDto,
} from "@qlp/api-client";

export interface CurriculumExamStoreState {
  response?: ResponseCurriculumExamDto;
  createDto: CreateCurriculumExamDto;
  createDtoErrors: Record<string, string[]>;
  updateDto: UpdateCurriculumExamDto;
  updateDtoErrors: Record<string, string[]>;
}

const initialState: CurriculumExamStoreState = {
  response: undefined,
  createDto: {
    title: "",
    description: "",
    durationMinutes: 30,
    passingScore: 60,
    questions: [],
  },
  createDtoErrors: {},
  updateDto: {},
  updateDtoErrors: {},
};

export interface CurriculumExamStore extends CurriculumExamStoreState {
  set: <T>(key: keyof CurriculumExamStoreState, value: T) => void;
  setNested: (path: string, value: unknown) => void;
  reset: () => void;
}

export const useCurriculumExamStore = create<CurriculumExamStore>((set) => ({
  ...initialState,
  set: (key, value) =>
    set({ [key]: value } as Partial<CurriculumExamStoreState>),
  setNested: (path, value) =>
    set((state) => setNestedValue(state, path, value)),
  reset: () => set(initialState),
}));
