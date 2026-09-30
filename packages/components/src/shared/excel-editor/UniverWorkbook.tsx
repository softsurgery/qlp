import React, { useEffect, useRef } from "react";
import {
  CommandType,
  LocaleType,
  mergeLocales,
  createUniver,
  type IWorkbookData,
} from "@univerjs/presets";
import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core";
import UniverPresetSheetsCoreEnUS from "@univerjs/preset-sheets-core/locales/en-US";
import UniverPresetSheetsCoreArSA from "@univerjs/preset-sheets-core/locales/ar-SA";
import "@univerjs/preset-sheets-core/lib/index.css";

export function UniverWorkbook({
  getSnapshot,
  editable,
  isDark,
  isFullscreen,
  locale,
  onSnapshot,
}: {
  getSnapshot: () => IWorkbookData;
  editable: boolean;
  isDark: boolean;
  isFullscreen: boolean;
  locale: string;
  onSnapshot: (snapshot: IWorkbookData) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const getSnapshotRef = useRef(getSnapshot);
  getSnapshotRef.current = getSnapshot;
  const onSnapshotRef = useRef(onSnapshot);
  onSnapshotRef.current = onSnapshot;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const container = document.createElement("div");
    container.style.height = "100%";
    container.style.width = "100%";
    host.append(container);

    const isArabic = locale.toLowerCase().startsWith("ar");
    const { univer, univerAPI } = createUniver({
      locale: isArabic ? LocaleType.AR_SA : LocaleType.EN_US,
      darkMode: isDark,
      locales: {
        [LocaleType.EN_US]: mergeLocales(UniverPresetSheetsCoreEnUS),
        [LocaleType.AR_SA]: mergeLocales(UniverPresetSheetsCoreArSA),
      },
      presets: [
        UniverSheetsCorePreset({
          container,
          header: true,
          toolbar: true,
          formulaBar: true,
          ribbonType: isFullscreen ? "classic" : "collapsed",
          contextMenu: editable,
          footer: {
            sheetBar: true,
            statisticBar: false,
            menus: true,
            zoomSlider: true,
          },
        }),
      ],
    });

    const workbook = univerAPI.createWorkbook(getSnapshotRef.current());
    if (!editable) {
      void workbook.getWorkbookPermission().setReadOnly();
    }

    let persistTimer = 0;
    const persist = () => {
      const next = univerAPI.getActiveWorkbook()?.save();
      if (next) onSnapshotRef.current(next);
    };
    const schedulePersist = () => {
      window.clearTimeout(persistTimer);
      persistTimer = window.setTimeout(persist, 250);
    };

    const disposable = univerAPI.addEvent(
      univerAPI.Event.CommandExecuted,
      (event) => {
        if (!editable) return;
        if (event.type !== CommandType.MUTATION) return;
        schedulePersist();
      },
    );

    return () => {
      window.clearTimeout(persistTimer);
      if (editable) persist();
      disposable.dispose();
      queueMicrotask(() => {
        univer.dispose();
        container.remove();
      });
    };
  }, [editable, isDark, isFullscreen, locale]);

  return (
    <div
      ref={hostRef}
      className="excel-editor-univer h-full min-h-0 w-full overflow-hidden [&_.univer]:h-full"
    />
  );
}
