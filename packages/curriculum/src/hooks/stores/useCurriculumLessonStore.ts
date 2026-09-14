import { create } from "zustand";
import { setNestedValue } from "@qlp/lib";
import type {
  ResponseCurriculumLessonDto,
  CreateCurriculumLessonDto,
  UpdateCurriculumLessonDto,
} from "@qlp/api-client";

export interface CurriculumLessonStoreState {
  response?: ResponseCurriculumLessonDto;
  createDto: CreateCurriculumLessonDto;
  createDtoErrors: Record<string, string[]>;
  updateDto: UpdateCurriculumLessonDto;
  updateDtoErrors: Record<string, string[]>;
}

const initialState: CurriculumLessonStoreState = {
  response: undefined,
  createDto: {
    title: "",
    description: "",
  },
  createDtoErrors: {},
  updateDto: {},
  updateDtoErrors: {},
};

export interface CurriculumLessonStore extends CurriculumLessonStoreState {
  set: <T>(key: keyof CurriculumLessonStoreState, value: T) => void;
  setNested: (path: string, value: unknown) => void;
  reset: () => void;
}

export const useCurriculumLessonStore = create<CurriculumLessonStore>((set) => ({
  ...initialState,
  set: (key, value) => set({ [key]: value } as Partial<CurriculumLessonStoreState>),
  setNested: (path, value) =>
    set((state) => setNestedValue(state, path, value)),
  reset: () => set(initialState),
}));
