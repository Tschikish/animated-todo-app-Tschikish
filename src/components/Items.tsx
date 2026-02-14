import React from "react";
import type { Todo } from "../hooks/use-todos";
import Item from "./Item";
import "./Items.css";
import { AnimatePresence, motion } from "framer-motion";
import { dragAndDrop } from "@formkit/drag-and-drop/react";
// import { animations } from "@formkit/drag-and-drop"; // optional, see below

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
}: TodoItemsProps) {
  const listRef = React.useRef<HTMLUListElement | null>(null);

  const visibleTodos = React.useMemo(
    () => applyFilter(todos, filter),
    [todos, filter]
  );
  const isFiltered = filter !== "all";

  React.useEffect(() => {
  const el = listRef.current;
  if (!el) return;

  const setVisibleTodos: React.Dispatch<React.SetStateAction<Todo[]>> = (value) => {
    const nextVisible =
      typeof value === "function" ? value(visibleTodos) : value;

    const nextAll = isFiltered
      ? mergeSortedSubsetIntoAll(todos, nextVisible)
      : nextVisible;

    onSort(nextAll);
  };

  const cleanup = dragAndDrop({
    parent: el,
    state: [visibleTodos, setVisibleTodos],
    plugins: [], // disable animations while debugging
    dragHandle: "[data-dnd-handle]",
    draggingClass: "dragging",
    dragPlaceholderClass: "ghost",
  });

  return () => {
    if (typeof cleanup === "function") cleanup();
  };
}, [visibleTodos, todos, isFiltered, onSort]);


  return (
    <ul className="todoList" ref={listRef}>
      <AnimatePresence initial={false}>
        {visibleTodos.map((t) => (
          <li key={t.id} id={t.id} className="dndItem">
            {/* ✅ animate inside, not the <li> itself */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
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
  );
}
