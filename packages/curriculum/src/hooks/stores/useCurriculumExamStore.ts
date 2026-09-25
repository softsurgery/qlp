import { create } from "zustand";
import { isEqual } from "lodash";
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
  initialUpdateDto: UpdateCurriculumExamDto;
  updateDto: UpdateCurriculumExamDto;
  updateDtoErrors: Record<string, string[]>;
  isChanged: boolean;
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
  initialUpdateDto: {},
  updateDto: {},
  updateDtoErrors: {},
  isChanged: false,
};

export interface CurriculumExamStore extends CurriculumExamStoreState {
  set: <T>(key: keyof CurriculumExamStoreState, value: T) => void;
  setNested: (path: string, value: unknown) => void;
  reset: () => void;
}

export const useCurriculumExamStore = create<CurriculumExamStore>((set) => ({
  ...initialState,
  set: (key, value) =>
    set((state) => {
      const nextState = { ...state, [key]: value };
      const isChanged = !isEqual(nextState.updateDto, nextState.initialUpdateDto);
      return { ...nextState, isChanged };
    }),
  setNested: (path, value) =>
    set((state) => {
      const nextState = setNestedValue(state, path, value);
      const isChanged = !isEqual(nextState.updateDto, nextState.initialUpdateDto);
      return { ...nextState, isChanged };
    }),
  reset: () => set(initialState),
}));
