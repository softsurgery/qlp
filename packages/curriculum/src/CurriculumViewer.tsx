import React from "react";
import { type CurriculumResource } from "@qlp/api-client";

interface CurriculumViewerProps {
  api: CurriculumResource;
  basePath: string;
  curriculumId: string;
}

export function CurriculumViewer({
  api,
  basePath,
  curriculumId,
}: CurriculumViewerProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">View Curriculum</h1>
      <p className="text-gray-500">Viewing curriculum ID: {curriculumId}</p>
      <p className="text-gray-500">Component skeleton prepared.</p>
    </div>
  );
}
