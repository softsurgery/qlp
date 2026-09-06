import { create } from "zustand";
import type {
  CreateRoleDto,
  ResponsePermissionDto,
  ResponseRoleDto,
  UpdateRoleDto,
} from "@qlp/api-client";
import type { FieldErrors } from "@qlp/form-builder";
import { setNestedValue } from "@/lib/store";

type PermissionMode = "create" | "update";

export interface RoleStoreState {
  response?: ResponseRoleDto;
  createDto: CreateRoleDto;
  updateDto: UpdateRoleDto;
  createDtoErrors: FieldErrors;
  updateDtoErrors: FieldErrors;
}

const emptyRole: CreateRoleDto = {
  label: "",
  description: "",
  permissions: [],
};

const initialState: RoleStoreState = {
  response: undefined,
  createDto: emptyRole,
  updateDto: { ...emptyRole },
  createDtoErrors: {},
  updateDtoErrors: {},
};

export interface RoleStore extends RoleStoreState {
  set: <T>(key: keyof RoleStoreState, value: T) => void;
  setNested: (path: string, value: unknown) => void;
  reset: () => void;
  isPermissionSelected: (permissionId: string, type: PermissionMode) => boolean;
  addPermission: (permission: ResponsePermissionDto, type: PermissionMode) => void;
  removePermission: (permissionId: string, type: PermissionMode) => void;
}

function dtoKey(type: PermissionMode) {
  return type === "create" ? "createDto" : "updateDto";
}

export const useRoleStore = create<RoleStore>((set, get) => ({
  ...initialState,
  set: (key, value) => set({ [key]: value } as Partial<RoleStoreState>),
  setNested: (path, value) =>
    set((state) => setNestedValue(state, path, value)),
  reset: () =>
    set({
      ...initialState,
      createDto: { ...emptyRole, permissions: [] },
      updateDto: { ...emptyRole, permissions: [] },
    }),
  isPermissionSelected: (permissionId, type) => {
    const permissions = get()[dtoKey(type)].permissions ?? [];
    return permissions.some((permission) => permission.permissionId === permissionId);
  },
  addPermission: (permission, type) => {
    const key = dtoKey(type);
    const current = get()[key].permissions ?? [];
    if (current.some((item) => item.permissionId === permission.id)) return;
    set((state) => ({
      [key]: {
        ...state[key],
        permissions: [...current, { permissionId: permission.id }],
      },
    }));
  },
  removePermission: (permissionId, type) => {
    const key = dtoKey(type);
    const current = get()[key].permissions ?? [];
    set((state) => ({
      [key]: {
        ...state[key],
        permissions: current.filter((item) => item.permissionId !== permissionId),
      },
    }));
  },
}));
