import React from "react";
import Header, { type Theme } from "@/components/Header";
import Input from "@/components/Input";
import Items, { type TodoFilter } from "@/components/Items";
import FilterButtons from "./components/FilterButtons";
import { useTodos } from "@/hooks/use-todos";

import "./App.css";

export default function App() {
  const [todos, actions] = useTodos();
  const [filter, setFilter] = React.useState<TodoFilter>("all");
  const [theme, setTheme] = React.useState<Theme>("dark");

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div className="page">
      <div className="shell">
        <Header theme={theme} onToggleTheme={toggleTheme} />

        <div className="inputOverlap">
          <Input onNewTodo={actions.insertTodo} />
        </div>

        {todos.length > 0 ? (
          <div className="listWrap">
            <Items
              todos={todos}
              filter={filter}
              onSort={actions.sortTodos}
              onDelete={actions.removeTodo}
              onCheck={actions.checkTodo}
              onUncheck={actions.uncheckTodo}
              onClearCompleted={actions.clearCompletedTodos}
            />

            <div className="filtersDock">
              <FilterButtons filter={filter} setFilter={setFilter} />
            </div>
          </div>
        ) : (
          <div className="emptyState">
            Start by entering your first TODO in the box above
          </div>
        )}

        <p className="hint">
          {todos.length > 0 ? "Drag and drop to reorder list" : ""}
        </p>
      </div>
    </div>
  );
}
