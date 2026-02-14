import type { TodoFilter } from "@/components/Items";
import type { Dispatch, SetStateAction } from "react";

function FilterButtons({
  filter,
  setFilter,
}: {
  filter: TodoFilter;
  setFilter: React.Dispatch<React.SetStateAction<TodoFilter>>;
}) {
  return (
    <div className="filterRow">
      <button
        className={`filterBtn ${filter === "all" ? "isActive" : ""}`}
        onClick={() => setFilter("all")}
        type="button"
      >
        All
      </button>
      <button
        className={`filterBtn ${filter === "active" ? "isActive" : ""}`}
        onClick={() => setFilter("active")}
        type="button"
      >
        Active
      </button>
      <button
        className={`filterBtn ${filter === "completed" ? "isActive" : ""}`}
        onClick={() => setFilter("completed")}
        type="button"
      >
        Completed
      </button>
    </div>
  );
}

export default FilterButtons;
