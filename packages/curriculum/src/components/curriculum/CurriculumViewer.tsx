import React from "react";
import { useApp } from "@qlp/contexts";
import { cn } from "@qlp/ui";

interface CurriculumViewerProps {
  className?: string;
  curriculumId: string;
  version?: number;
  revealAnswers?: boolean;
}

export function CurriculumViewer({
  className,
  curriculumId,
  version,
  revealAnswers,
}: CurriculumViewerProps) {
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin" ? baseApi.adminCurriculum : baseApi.curriculum;
  return (
    <div className={cn("p-6", className)}>
      <h1 className="text-2xl font-bold mb-4">View Curriculum</h1>
      <p className="text-gray-500">Viewing curriculum ID: {curriculumId}</p>
      <p className="text-gray-500">Component skeleton prepared.</p>
    </div>
  );
}
