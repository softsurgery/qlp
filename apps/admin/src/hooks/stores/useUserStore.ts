import { create } from "zustand";
import type {
  CreateUserDto,
  ResponseUserDto,
  UpdateUserDto,
} from "@qlp/api-client";
import { setNestedValue } from "@/lib/store";

type FieldErrors = Record<string, string[] | undefined>;

export interface UserStoreState {
  response?: ResponseUserDto;
  createDto: CreateUserDto;
  updateDto: UpdateUserDto;
  createDtoErrors: FieldErrors;
  updateDtoErrors: FieldErrors;
  confirmPassword: string;
  setManualPassword: boolean;
}

const initialCreateDto: CreateUserDto = {
  username: "",
  email: "",
  password: "",
};

const initialState: UserStoreState = {
  response: undefined,
  createDto: initialCreateDto,
  updateDto: {},
  createDtoErrors: {},
  updateDtoErrors: {},
  confirmPassword: "",
  setManualPassword: false,
};

export interface UserStore extends UserStoreState {
  set: <T>(key: keyof UserStoreState, value: T) => void;
  setNested: (path: string, value: unknown) => void;
  reset: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  ...initialState,
  set: (key, value) => set({ [key]: value } as Partial<UserStoreState>),
  setNested: (path, value) =>
    set((state) => setNestedValue(state, path, value)),
  reset: () => set({ ...initialState, createDto: { ...initialCreateDto } }),
}));
