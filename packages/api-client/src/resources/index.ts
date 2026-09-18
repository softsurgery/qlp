import type { AxiosInstance } from "axios";
import { createAdminAuthResource } from "./admin-auth.js";
import { createAuthResource } from "./auth.js";
import { createCurriculumResource } from "./curriculum.js";
import { createAdminMediaResource } from "./admin-media.js";
import { createPermissionResource } from "./permission.js";
import { createRoleResource } from "./roles.js";
import { createUploadResource } from "./storage.js";
import { createUserResource } from "./users.js";

export function createResources(http: AxiosInstance) {
  return {
    auth: createAuthResource(http),
    adminAuth: createAdminAuthResource(http),
    user: createUserResource(http),
    role: createRoleResource(http),
    permission: createPermissionResource(http),
    upload: createUploadResource(http),
    curriculum: createCurriculumResource(http, "/curriculum"),
    adminCurriculum: createCurriculumResource(http, "/admin/curriculum"),
    adminMedia: createAdminMediaResource(http),
  };
}

export type ApiResources = ReturnType<typeof createResources>;
