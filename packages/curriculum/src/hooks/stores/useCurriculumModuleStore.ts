import { create } from "zustand";
import { isEqual } from "lodash";
import { setNestedValue } from "@qlp/lib";
import type {
  ResponseCurriculumModuleDto,
  CreateCurriculumModuleDto,
  UpdateCurriculumModuleDto,
} from "@qlp/api-client";

export interface CurriculumModuleStoreState {
  response?: ResponseCurriculumModuleDto;
  createDto: CreateCurriculumModuleDto;
  createDtoErrors: Record<string, string[]>;
  initialUpdateDto: UpdateCurriculumModuleDto;
  updateDto: UpdateCurriculumModuleDto;
  updateDtoErrors: Record<string, string[]>;
  isChanged: boolean;
}

const initialState: CurriculumModuleStoreState = {
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

export interface CurriculumModuleStore extends CurriculumModuleStoreState {
  set: <T>(key: keyof CurriculumModuleStoreState, value: T) => void;
  setNested: (path: string, value: unknown) => void;
  reset: () => void;
}

export const useCurriculumModuleStore = create<CurriculumModuleStore>((set) => ({
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
