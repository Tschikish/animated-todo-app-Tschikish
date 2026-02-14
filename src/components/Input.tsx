import React, { type FormEvent } from "react";
import "./Input.css";

type InputProps = {
  onNewTodo: (content: string) => void;
};

export default function Input({ onNewTodo }: InputProps) {
  const [value, setValue] = React.useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const txt = value.trim();
    if (!txt) return;
    onNewTodo(txt);
    console.log(value)
    setValue("");
  };

  return (
    <form className="todoForm" onSubmit={onSubmit}>
      <div className="todoInputWrap">
        <span className="todoInputCircle" aria-hidden="true" />
        <input
          className="todoInput"
          name="todo"
          type="text"
          placeholder="Create a new todo..."
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          required
        />
      </div>
    </form>
  );
}