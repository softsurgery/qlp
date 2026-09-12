import React from "react";
import { type DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export interface useDnDServiceProps<T> {
  items: T[];
  setItems: (items: T[]) => void;
  renderChild: (item: T, index: number) => React.ReactNode;
  getId: (item: T) => string | number;
  createNewItem: () => void;
  deleteItem?: (id: string | number) => void;
  deleteLastItem?: boolean;
}

export function useDnDService<T>({
  items,
  setItems,
  renderChild,
  getId,
  createNewItem,
  deleteItem,
  deleteLastItem = false,
}: useDnDServiceProps<T>) {
  const handleDelete = (idToDelete: string | number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => getId(item) !== idToDelete));
    }
    if (deleteLastItem && items.length === 1) {
      setItems([]);
    }
    deleteItem?.(idToDelete);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => getId(item) === active.id);
    const newIndex = items.findIndex((item) => getId(item) === over.id);

    setItems(arrayMove(items, oldIndex, newIndex));
  };

  const renderedItems = items.map((item, index) => ({
    ...item,
    child: renderChild(item, index),
  }));

  return {
    items: renderedItems,
    handleDragEnd,
    handleDelete,
    createNewItem,
  };
}
