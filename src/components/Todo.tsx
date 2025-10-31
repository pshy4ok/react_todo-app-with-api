/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../types/Todo';

type Props = {
  todo: TodoType;
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  onToggle?: (id: number, nextCompleted: boolean) => void;
  onUpdateTitle?: (id: number, title: string) => Promise<boolean>;
};

export const Todo: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  onToggle,
  onUpdateTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setTitle(todo.title);
  }, [todo.title]);

  const startEditing = () => {
    setTitle(todo.title);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setTitle(todo.title);
    setIsEditing(false);
  };

  const commitEditing = async () => {
    const trimmed = title.trim();

    if (trimmed === '') {
      onDelete?.(todo.id);

      return;
    }

    if (trimmed === todo.title) {
      setIsEditing(false);

      return;
    }

    const ok = await (onUpdateTitle?.(todo.id, trimmed) ?? Promise.resolve(false));

    if (ok) {
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle?.(todo.id, !todo.completed)}
          disabled={isLoading}
        />
      </label>

      {!isEditing && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={startEditing}
        >
          {todo.title}
        </span>
      )}

      {isEditing && (
        <form
          onSubmit={e => {
            e.preventDefault();
            void commitEditing();
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={() => void commitEditing()}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                cancelEditing();
              }
            }}
          />
        </form>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete?.(todo.id)}
          disabled={isLoading}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
