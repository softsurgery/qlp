import React from "react";
import { useApp } from "@qlp/contexts";

interface CurriculumViewerProps {
  curriculumId: string;
  version?: number;
  revealAnswers?: boolean;
}

export function CurriculumViewer({
  curriculumId,
  version,
  revealAnswers,
}: CurriculumViewerProps) {
  const { api: baseApi, appType } = useApp();
  const api = appType === "admin" ? baseApi.adminCurriculum : baseApi.curriculum;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">View Curriculum</h1>
      <p className="text-gray-500">Viewing curriculum ID: {curriculumId}</p>
      <p className="text-gray-500">Component skeleton prepared.</p>
    </div>
  );
}
