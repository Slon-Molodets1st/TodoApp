import React from "react";
import { Todo, TodoUpdate } from "../types";

interface TodoListProps{
    todos: Todo[];
    onUpdateTodo: (id: number, todo: TodoUpdate) => void;
    onDeleteTodo: (id: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
    todos,
    onUpdateTodo,
    onDeleteTodo
}) => {
    const handleToggleComplete = (todo: Todo) => {
        onUpdateTodo(todo.id, {completed: !todo.completed});
    };

    return (
        <div className="todo-list">
            {todos.length === 0 ? (
                <p className="empty-message">Нет задач. Создайте первую!</p>
            ) : (
                <ul className="todo-items">
                    {todos.map((todo) => (
                        <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                            <div className="todo-content">
                                <div className="todo-header">
                                    <input type="checkbox" checked={todo.completed} onChange={() => handleToggleComplete(todo)} className="todo-checkbox"/>
                                    <h3 className="todo-title">{todo.title}</h3>
                                    <span className="todo-date">
                                        {new Date(todo.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                {todo.description && (
                                    <p className="todo-description">{todo.description}</p>
                                )}
                            </div>
                            <button onClick={() => onDeleteTodo(todo.id)} className="btn btn-danger">Удалить</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};