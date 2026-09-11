import { create } from "zustand";
import type { ResponseCurriculumDto } from "@qlp/api-client";

export interface CurriculumStoreState {
  response?: ResponseCurriculumDto;
}

const initialState: CurriculumStoreState = {
  response: undefined,
};

export interface CurriculumStore extends CurriculumStoreState {
  set: <T>(key: keyof CurriculumStoreState, value: T) => void;
  reset: () => void;
}

export const useCurriculumStore = create<CurriculumStore>((set) => ({
  ...initialState,
  set: (key, value) => set({ [key]: value } as Partial<CurriculumStoreState>),
  reset: () => set(initialState),
}));
