import { create } from "zustand";
import { isEqual } from "lodash";
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
  initialUpdateDto: UpdateCurriculumLessonDto;
  updateDto: UpdateCurriculumLessonDto;
  updateDtoErrors: Record<string, string[]>;
  isChanged: boolean;
}

const initialState: CurriculumLessonStoreState = {
  response: undefined,
  createDto: {
    title: "",
    description: "",
  },
  createDtoErrors: {},
  initialUpdateDto: {},
  updateDto: {},
  updateDtoErrors: {},
  isChanged: false,
};

export interface CurriculumLessonStore extends CurriculumLessonStoreState {
  set: <T>(key: keyof CurriculumLessonStoreState, value: T) => void;
  setNested: (path: string, value: unknown) => void;
  reset: () => void;
}

export const useCurriculumLessonStore = create<CurriculumLessonStore>((set) => ({
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
