import { create } from "zustand";
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
  updateDto: UpdateCurriculumModuleDto;
  updateDtoErrors: Record<string, string[]>;
}

const initialState: CurriculumModuleStoreState = {
  response: undefined,
  createDto: {
    title: "",
    description: "",
  },
  createDtoErrors: {},
  updateDto: {},
  updateDtoErrors: {},
};

export interface CurriculumModuleStore extends CurriculumModuleStoreState {
  set: <T>(key: keyof CurriculumModuleStoreState, value: T) => void;
  setNested: (path: string, value: unknown) => void;
  reset: () => void;
}

export const useCurriculumModuleStore = create<CurriculumModuleStore>((set) => ({
  ...initialState,
  set: (key, value) => set({ [key]: value } as Partial<CurriculumModuleStoreState>),
  setNested: (path, value) =>
    set((state) => setNestedValue(state, path, value)),
  reset: () => set(initialState),
}));
