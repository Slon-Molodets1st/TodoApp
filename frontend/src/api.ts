import axios from "axios";
import {Todo, TodoCreate, TodoUpdate} from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const api = {
    getTodos: () => apiClient.get<Todo[]>('/api/todos/'),
    getTodo: (id: number) => apiClient.get<Todo>(`/api/todos/${id}`),
    createTodo: (todo: TodoCreate) => apiClient.post<Todo>('/api/todos/', todo),
    updateTodo: (id: number, todo: TodoUpdate) =>
        apiClient.put<Todo>(`/api/todos/${id}`, todo),
    deleteTodo: (id: number) => apiClient.delete(`/api/todos/${id}`),
};