import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useUploadSrc(upload?: { id?: number; slug?: string } | null) {
  const query = useQuery({
    queryKey: ["upload-src", upload?.id, upload?.slug],
    enabled: Boolean(upload?.id || upload?.slug),
    queryFn: async () => {
      if (upload?.slug) return api.upload.getUploadBySlug(upload.slug);
      if (upload?.id) return api.upload.getUploadById(upload.id);
      return null;
    },
  });

  React.useEffect(() => {
    return () => {
      if (query.data) URL.revokeObjectURL(query.data);
    };
  }, [query.data]);

  return query;
}
