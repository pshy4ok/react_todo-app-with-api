import { FILTERS, FilterType } from '../constants/filters';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3646;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const getFilteredTodos = (todos: Todo[], filter: FilterType) => {
  switch (filter) {
    case FILTERS.active:
      return todos.filter(todo => !todo.completed);
    case FILTERS.completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export const createTodo = (title: string) => {
  const trimmedTitle = title.trim();

  return client.post<Todo>('/todos', {
    title: trimmedTitle,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
