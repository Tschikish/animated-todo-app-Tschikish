import type { Todo } from "../hooks/use-todos";
import checkIconUrl from "../components/icons/icon-check.svg";
import "./Item.css";
import IconCross from "./icons/icon-cross.svg";

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
          <svg
            className="gripIcon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="12" r="1" />
            <circle cx="9" cy="5" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="15" cy="19" r="1" />
          </svg>
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
          <img src={checkIconUrl} className="itemCheckIcon" alt="check" />
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
        <img src={IconCross} alt="cross"/>
      </button>
    </div>
  );
}
