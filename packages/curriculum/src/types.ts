export type { CurriculumResource } from "@qlp/api-client";

export interface CurriculumUiProps {
  api: import("@qlp/api-client").CurriculumResource;
  basePath: string;
}

export type Selection =
  | { kind: "curriculum" }
  | { kind: "module"; id: string }
  | { kind: "lesson"; id: string }
  | { kind: "exam"; id: string }
  | { kind: "material"; id: string };

