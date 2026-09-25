import type { AxiosInstance } from "axios";
import { createAdminAuthResource } from "./admin-auth.js";
import { createAuthResource } from "./auth.js";
import {
  createCurriculumExamsResource,
  createCurriculumLessonsResource,
  createCurriculumModulesResource,
  createCurriculumResource,
} from "./curriculum/index.js";
import { createAdminMediaResource } from "./admin-media.js";
import { createMediaResource } from "./media.js";
import { createMeetingResource } from "./meetings.js";
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
    curriculumModules: createCurriculumModulesResource(http, "/curriculum"),
    curriculumLessons: createCurriculumLessonsResource(http, "/curriculum"),
    curriculumExams: createCurriculumExamsResource(http, "/curriculum"),

    adminCurriculum: createCurriculumResource(http, "/admin/curriculum"),
    adminCurriculumModules: createCurriculumModulesResource(
      http,
      "/admin/curriculum",
    ),
    adminCurriculumLessons: createCurriculumLessonsResource(
      http,
      "/admin/curriculum",
    ),
    adminCurriculumExams: createCurriculumExamsResource(
      http,
      "/admin/curriculum",
    ),

    media: createMediaResource(http),
    adminMedia: createAdminMediaResource(http),
    meetings: createMeetingResource(http),
  };
}

export type ApiResources = ReturnType<typeof createResources>;
