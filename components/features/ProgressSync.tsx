"use client";

import { useEffect } from "react";
import { syncValidatedFromServer } from "@/lib/lesson-progress";

/** Charge la progression du compte dans le cache local au montage de l'app. */
export function ProgressSync() {
  useEffect(() => {
    syncValidatedFromServer();
  }, []);
  return null;
}
