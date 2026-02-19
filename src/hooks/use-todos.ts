import { useMemo, useReducer } from "react";
import { produce } from "immer";

export type Todo = {
  id: string;
  content: string;
  completed: boolean;
};

type Action =
  | { type: "insert"; content: string }
  | { type: "remove"; id: string }
  | { type: "check"; id: string }
  | { type: "uncheck"; id: string }
  | { type: "clearCompleted" }
  | { type: "setOrder"; todos: Todo[] };

const seedTodos: Todo[] = [
  { id: "t-1", content: "Check up on those Jira tickets I've been avoiding", completed: false },
  { id: "t-2", content: "Brush up my CV", completed: true },
  { id: "t-3", content: "30 minute Yoga session", completed: false },
  { id: "t-4", content: "Text friends instead of just liking their stories", completed: false },
  { id: "t-5", content: "Clean up 200+ unread emails", completed: true },
  { id: "t-6", content: "Cry about implementing Motion and DND", completed: false },
];

function reducer(state: Todo[], action: Action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case "insert": {
        draft.unshift({
          id: `t-${crypto.randomUUID()}`,
          content: action.content,
          completed: false,
        });
        break;
      }
      case "remove": {
        return draft.filter((t) => t.id !== action.id);
      }
      case "check": {
        const t = draft.find((x) => x.id === action.id);
        if (t) t.completed = true;
        break;
      }
      case "uncheck": {
        const t = draft.find((x) => x.id === action.id);
        if (t) t.completed = false;
        break;
      }
      case "clearCompleted": {
        return draft.filter((t) => !t.completed);
      }
      case "setOrder": {
        return action.todos;
      }
    }
  });
}

export function useTodos() {
  const [todos, dispatch] = useReducer(reducer, seedTodos);

  const actions = useMemo(
    () => ({
      insertTodo: (content: string) => dispatch({ type: "insert", content }),
      removeTodo: (id: string) => dispatch({ type: "remove", id }),
      checkTodo: (id: string) => dispatch({ type: "check", id }),
      uncheckTodo: (id: string) => dispatch({ type: "uncheck", id }),
      clearCompletedTodos: () => dispatch({ type: "clearCompleted" }),
      sortTodos: (next: Todo[]) => dispatch({ type: "setOrder", todos: next }),
    }),
    [],
  );

  return [todos, actions] as const;
}
