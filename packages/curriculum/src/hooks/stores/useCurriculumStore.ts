import { create } from "zustand";
import { setNestedValue } from "@qlp/lib";
import type {
  ResponseCurriculumDto,
  CreateCurriculumDto,
  UpdateCurriculumDto,
} from "@qlp/api-client";
import { CurriculumStatus } from "@qlp/api-client";

export interface CurriculumStoreState {
  response?: ResponseCurriculumDto;
  createDto: CreateCurriculumDto;
  createDtoErrors: Record<string, string[]>;
  updateDto: UpdateCurriculumDto;
  updateDtoErrors: Record<string, string[]>;
}

const initialState: CurriculumStoreState = {
  response: undefined,
  createDto: {
    title: "",
    slug: "",
    description: "",
    status: CurriculumStatus.Draft,
  },
  createDtoErrors: {},
  updateDto: {},
  updateDtoErrors: {},
};

export interface CurriculumStore extends CurriculumStoreState {
  set: <T>(key: keyof CurriculumStoreState, value: T) => void;
  setNested: (path: string, value: unknown) => void;
  reset: () => void;
}

export const useCurriculumStore = create<CurriculumStore>((set) => ({
  ...initialState,
  set: (key, value) => set({ [key]: value } as Partial<CurriculumStoreState>),
  setNested: (path, value) =>
    set((state) => setNestedValue(state, path, value)),
  reset: () => set(initialState),
}));
