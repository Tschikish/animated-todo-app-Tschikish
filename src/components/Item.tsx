import React from "react";
import type { Todo } from "../hooks/use-todos";
import checkIconUrl from "../components/icons/icon-check.svg";
import "./Item.css";

type ItemProps = Todo & {
  onDelete: (id: string) => void;
  onCheck: (id: string) => void;
  onUncheck: (id: string) => void;
  showGrip?: boolean;
};

export default function Item({
  id,
  content,
  completed,
  onDelete,
  onCheck,
  onUncheck,
  showGrip = false,
}: ItemProps) {
  const inputId = `todo-${id}`;

  return (
    <div className="itemRow" data-completed={completed ? "true" : "false"}>
      {showGrip ? (
        <span data-dnd-handle className="itemGrip" aria-hidden="true">
          ⋮⋮
        </span>
      ) : null}

      <div className="itemCheckWrap">
        <input
          id={inputId}
          type="checkbox"
          checked={completed}
          onChange={() => (completed ? onUncheck(id) : onCheck(id))}
          className="itemCheckbox"
        />
        <span className="itemCheckboxVisual" aria-hidden="true">
          <img src={checkIconUrl} className="itemCheckIcon" alt="" />
        </span>
      </div>

      <label htmlFor={inputId} className="itemLabel">
        {content}
      </label>

      <button
        type="button"
        className="itemDelete"
        onClick={() => onDelete(id)}
        aria-label="Delete todo"
      >
        ✕
      </button>
    </div>
  );
}
