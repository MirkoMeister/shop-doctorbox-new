"use client";

import { useEffect, useRef } from "react";
import { trackViewItemList, type TrackItem } from "@/lib/tracking/events";

/** view_item_list for a collection (same event the old theme pushed on collection pages) */
export function TrackViewItemList({ listId, listName, items }: { listId: string; listName: string; items: TrackItem[] }) {
  const tracked = useRef<string | null>(null);
  useEffect(() => {
    // once per list; the ref also absorbs React's double effect run in development
    if (tracked.current === listId) return;
    tracked.current = listId;
    trackViewItemList(items, listId, listName);
  }, [items, listId, listName]);
  return null;
}
