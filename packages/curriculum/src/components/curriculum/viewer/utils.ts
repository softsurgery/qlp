import {
  MaterialType,
  type ResponseCurriculumExamDto,
  type ResponseCurriculumLessonDto,
  type ResponseCurriculumLessonMaterialDto,
  type ResponseCurriculumModuleDto,
} from "@qlp/api-client";

export type OutlineEntry =
  | {
      kind: "lesson";
      id: string;
      sortOrder: number;
      lesson: ResponseCurriculumLessonDto;
    }
  | {
      kind: "exam";
      id: string;
      sortOrder: number;
      exam: ResponseCurriculumExamDto;
    };

export function latestById<
  T extends { id: string; isLatest?: boolean; version?: number },
>(items?: T[]): T[] {
  if (!items?.length) return [];
  const map = new Map<string, T>();
  for (const item of items) {
    const existing = map.get(item.id);
    if (!existing) {
      map.set(item.id, item);
      continue;
    }
    if (item.isLatest && !existing.isLatest) {
      map.set(item.id, item);
      continue;
    }
    if ((item.version ?? 0) > (existing.version ?? 0)) {
      map.set(item.id, item);
    }
  }
  return Array.from(map.values());
}

export function sortByOrder<T extends { sortOrder?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export function moduleLessons(module?: ResponseCurriculumModuleDto | null) {
  return sortByOrder(latestById(module?.lessons));
}

export function moduleExams(module?: ResponseCurriculumModuleDto | null) {
  return sortByOrder(latestById(module?.exams));
}

export function lessonMaterials(lesson?: ResponseCurriculumLessonDto | null) {
  return sortByOrder(latestById(lesson?.materials));
}

export function moduleOutline(
  module?: ResponseCurriculumModuleDto | null,
): OutlineEntry[] {
  const lessons: OutlineEntry[] = moduleLessons(module).map((lesson) => ({
    kind: "lesson",
    id: lesson.id,
    sortOrder: lesson.sortOrder || 0,
    lesson,
  }));
  const exams: OutlineEntry[] = moduleExams(module).map((exam) => ({
    kind: "exam",
    id: exam.id,
    sortOrder: exam.sortOrder || 0,
    exam,
  }));
  return [...lessons, ...exams].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function hasRichText(value?: string | null) {
  if (!value) return false;
  const text = value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 0;
}

export function isHttpUrl(value?: string | null) {
  return !!value && /^https?:\/\//i.test(value.trim());
}

export function materialKind(
  type?: string,
): "video" | "reading" | "audio" | "link" | "text" {
  if (type === MaterialType.Video || type === "video") return "video";
  if (type === MaterialType.Audio || type === "audio") return "audio";
  if (type === MaterialType.Link || type === "link") return "link";
  if (type === MaterialType.Text || type === "text") return "text";
  return "reading";
}

export function moduleMaterialStats(module?: ResponseCurriculumModuleDto | null) {
  const materials = moduleLessons(module).flatMap((lesson) =>
    lessonMaterials(lesson),
  );
  const videos = materials.filter((item) => materialKind(item.type) === "video")
    .length;
  const audio = materials.filter((item) => materialKind(item.type) === "audio")
    .length;
  const readings = materials.filter((item) => {
    const kind = materialKind(item.type);
    return kind === "reading" || kind === "text" || kind === "link";
  }).length;
  const assessments = moduleExams(module).length;
  return { videos, audio, readings, assessments, materials };
}

export function firstOutlineItemId(module?: ResponseCurriculumModuleDto | null) {
  const outline = moduleOutline(module);
  for (const entry of outline) {
    if (entry.kind === "lesson") {
      const materials = lessonMaterials(entry.lesson);
      if (materials[0]) return `material:${materials[0].id}`;
      return `lesson:${entry.lesson.id}`;
    }
    return `exam:${entry.exam.id}`;
  }
  return undefined;
}

export function formatShortDate(value?: Date | string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
