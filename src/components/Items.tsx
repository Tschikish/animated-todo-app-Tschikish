import React from "react";

import type { Todo } from "../hooks/use-todos";

import Item from "./Item";
import "./Items.css";

import { AnimatePresence, motion } from "framer-motion";
import { animations } from "@formkit/drag-and-drop";
import { dragAndDrop } from "@formkit/drag-and-drop/react";

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

function mergeSortedSubsetIntoAll(all: Todo[], sortedVisible: Todo[]) {
  const sortedIds = new Set(sortedVisible.map((t) => t.id));
  const result: Todo[] = [];
  let visibleIndex = 0;

  for (const t of all) {
    if (sortedIds.has(t.id)) result.push(sortedVisible[visibleIndex++]);
    else result.push(t);
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
  onClearCompleted,
}: TodoItemsProps) {
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const cleanupRef = React.useRef<null | (() => void)>(null);

  const visibleTodos = React.useMemo(
    () => applyFilter(todos, filter),
    [todos, filter]
  );

  const itemsLeft = React.useMemo(
    () => visibleTodos.filter((t) => !t.completed).length,
    [visibleTodos]
  );

  const isFiltered = filter !== "all";

  const attachDnd = React.useEffectEvent(() => {
    const el = listRef.current;
    if (!el) return;

    const validIds = new Set(visibleTodos.map((t) => t.id));

    const setVisibleTodos: React.Dispatch<React.SetStateAction<Todo[]>> = (
      value
    ) => {
      const nextVisible =
        typeof value === "function" ? value(visibleTodos) : value;

      // Redundant, but keeping it just in case since filtered items were previously draggable.
      const nextAll = isFiltered
        ? mergeSortedSubsetIntoAll(todos, nextVisible)
        : nextVisible;

      onSort(nextAll);
    };

    const cleanup = dragAndDrop({
      parent: el,
      state: [visibleTodos, setVisibleTodos],
      plugins: [animations()],
      dragHandle: "[data-dnd-handle]",
      draggingClass: "ghost",
      dragPlaceholderClass: "dragging",
      onDragend: ({ draggedNode }) => {
        draggedNode.el.classList.remove("dragging");
        draggedNode.el.classList.remove("ghost");
      },
      draggable: (node) => validIds.has(node.id),
    });

    cleanupRef.current = typeof cleanup === "function" ? cleanup : null;
  });

  const visibleKey = React.useMemo(
    () => visibleTodos.map((t) => t.id).join("|"),
    [visibleTodos]
  );

  React.useEffect(() => {
    attachDnd();
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [visibleKey, attachDnd]);

  return (
    <div className="itemsCard">
      <ul className="todoList" ref={listRef} style={{ overflowAnchor: "none" }}>
        <AnimatePresence initial={false}>
          {visibleTodos.map((t) => (
            <li key={t.id} id={t.id} className="dndItem">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Item
                  {...t}
                  onDelete={onDelete}
                  onCheck={onCheck}
                  onUncheck={onUncheck}
                  showGrip={!isFiltered}
                />
              </motion.div>
            </li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="itemsFooter">
        <p className="itemsLeft">{itemsLeft} items left</p>
        <button
          type="button"
          className="clearCompleted"
          onClick={onClearCompleted}
        >
          Clear Completed
        </button>
      </div>
    </div>
  );
}
