from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, crud
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Todo API",
    description="Простое REST API для управления задачами",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Добро пожаловать в Todo API!", "docs": "/docs"}

@app.post("/api/todos/", response_model=schemas.Todo, status_code=status.HTTP_201_CREATED, tags=["Todos"])
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    return crud.create_todo(db=db, todo=todo)

@app.get("/api/todos/", response_model=List[schemas.Todo], tags=["Todos"])
def read_todos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    todos = crud.get_todos(db, skip=skip, limit=limit)
    return todos

@app.get("/api/todos/{todo_id}", response_model=schemas.Todo, tags=["Todos"])
def read_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = crud.get_todo(db, todo_id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    return db_todo

@app.put("/api/todos/{todo_id}", response_model=schemas.Todo, tags=["Todos"])
def update_todo(todo_id: int, todo: schemas.TodoUpdate, db: Session = Depends(get_db)):
    db_todo = crud.update_todo(db, todo_id, todo)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    return db_todo

@app.delete("/api/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Todos"])
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    if not crud.delete_todo(db, todo_id):
        raise HTTPException(status_code=404, detail="Задача не найдена")
    return None
