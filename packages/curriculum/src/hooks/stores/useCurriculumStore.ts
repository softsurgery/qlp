import { create } from "zustand";
import { isEqual } from "lodash";
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
  initialUpdateDto: UpdateCurriculumDto;
  updateDto: UpdateCurriculumDto;
  updateDtoErrors: Record<string, string[]>;
  isChanged: boolean;
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
  initialUpdateDto: {},
  updateDto: {},
  updateDtoErrors: {},
  isChanged: false,
};

export interface CurriculumStore extends CurriculumStoreState {
  set: <T>(key: keyof CurriculumStoreState, value: T) => void;
  setNested: (path: string, value: unknown) => void;
  reset: () => void;
}

export const useCurriculumStore = create<CurriculumStore>((set) => ({
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
