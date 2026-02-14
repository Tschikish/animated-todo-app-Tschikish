import React from "react";
import type { Todo } from "../hooks/use-todos";
import Item from "./Item";
import "./Items.css";
import { AnimatePresence, motion } from "framer-motion";
import { dragAndDrop } from "@formkit/drag-and-drop/react";
import { animations } from "@formkit/drag-and-drop";

export type TodoFilter = "all" | "active" | "completed";

export type TodoItemsProps = {
  todos: Todo[];
  filter: TodoFilter;
  onSort: (todos: Todo[]) => void;
  onDelete: (id: string) => void;
  onCheck: (id: string) => void;
  onUncheck: (id: string) => void;
  onClearCompleted: () => void;
};

function applyFilter(todos: Todo[], filter: TodoFilter) {
  if (filter === "active") return todos.filter((t) => !t.completed);
  if (filter === "completed") return todos.filter((t) => t.completed);
  return todos;
}

/**
 * Rebuilds the "full todos" array after sorting a filtered subset.
 * Keeps the relative order of todos not in the visible subset.
 */
function mergeSortedSubsetIntoAll(all: Todo[], sortedVisible: Todo[]) {
  const sortedIds = new Set(sortedVisible.map((t) => t.id));
  const visibleById = new Map(sortedVisible.map((t) => [t.id, t] as const));

  // Replace only the items in the visible subset, but keep their new order.
  const result: Todo[] = [];
  let visibleIndex = 0;

  for (const t of all) {
    if (sortedIds.has(t.id)) {
      result.push(sortedVisible[visibleIndex++]);
    } else {
      result.push(t);
    }
  }

  // Safety: if for some reason visible todos weren't all placed (shouldn't happen)
  // append missing (keeps app stable rather than dropping items)
  if (visibleIndex < sortedVisible.length) {
    for (; visibleIndex < sortedVisible.length; visibleIndex++) {
      const extra = sortedVisible[visibleIndex];
      if (!visibleById.has(extra.id)) continue;
      result.push(extra);
    }
  }

  return result;
}

export default function Items({
  todos,
  filter,
  onSort,
  onDelete,
  onCheck,
  onUncheck,
}: TodoItemsProps) {
  const listRef = React.useRef<HTMLUListElement | null>(null);

  const visibleTodos = React.useMemo(
    () => applyFilter(todos, filter),
    [todos, filter],
  );
  const isFiltered = filter !== "all";

  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const setVisibleTodos: React.Dispatch<React.SetStateAction<Todo[]>> = (
      value,
    ) => {
      const nextVisible =
        typeof value === "function" ? value(visibleTodos) : value;

      const nextAll = isFiltered
        ? mergeSortedSubsetIntoAll(todos, nextVisible)
        : nextVisible;

      onSort(nextAll);
    };

    dragAndDrop({
      parent: el,
      state: [visibleTodos, setVisibleTodos],
      plugins: [animations()],
      dragHandle: isFiltered ? undefined : "[data-dnd-handle]",
      draggingClass: "dragging",
      dragPlaceholderClass: "ghost",
    });
  }, [visibleTodos, todos, onSort, isFiltered]);

  return (
    <ul className="todoList" ref={listRef}>
      <AnimatePresence initial={false}>
        {visibleTodos.map((t) => (
          <motion.li
            key={t.id}
            id={t.id}
            className="dndItem"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Item
              {...t}
              onDelete={onDelete}
              onCheck={onCheck}
              onUncheck={onUncheck}
              showGrip={!isFiltered}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
