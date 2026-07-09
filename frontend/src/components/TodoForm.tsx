import React, { useState } from 'react';
import { TodoCreate } from '../types';

interface TodoFormProps {
    onAddTodo: (todo: TodoCreate) =>void;
}

export const TodoForm: React.FC<TodoFormProps> = ({onAddTodo}) =>{
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        if (title.trim()){
            onAddTodo({title: title.trim(), description: description.trim() || undefined});
            setTitle('');
            setDescription('');
        }
    };

    return(
        <form onSubmit={handleSubmit} className="todo-form">
            <div className="form-group">
                <input type="text" placeholder="Название задачи" value={title} onChange={(e) => setTitle(e.target.value) } className="form-input" required/>
            </div>
            <div className="form-group">
                <input type="text" placeholder="Описание (опционально)" value={description} onChange={(e) => setDescription(e.target.value) } className="form-input"/>
            </div>
            <button type="submit" className="btn btn-primary">Добавить задачу</button>
        </form>
    )
}
