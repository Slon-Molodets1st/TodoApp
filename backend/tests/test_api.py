import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app, get_db
from app.database import Base
from app.models import Todo

SQLALCHEMY_DATABASE_URL = 'sqlite:///./test.db'
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_create_todo():
    response = client.post(
        "/api/todos/",
        json={"title": "Тестовая задача", "description": "Описание задачи"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Тестовая задача"
    assert data["description"] == "Описание задачи"
    assert data["completed"] == False
    assert "id" in data

def test_read_todos():
    client.post("/api/todos", json={"title": "Задача 1"})
    client.post("/api/todos", json={"title": "Задача 2"})

    response = client.get("/api/todos/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2

def test_read_single_todo():
    create_response = client.post("/api/todos/", json={"title": "Уникальная задача"})
    todo_id = create_response.json()["id"]

    response = client.get(f"/api/todos/{todo_id}")
    assert response.status_code == 200
    data = response. json()
    assert data["title"] == "Уникальная задача"

def test_update_todo():
    create_response = client.post("/api/todos", json={"title": "Задача для обновления"})
    todo_id = create_response.json()["id"]

    response = client.put(
        f"/api/todos/{todo_id}",
        json={"title": "Обновленная задача", "complrted": True}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Обновленная задача"
    assert data["completed"] == True

def test_delete_todo():
    create_response = client.post("/api/todos/", json={"title": "Задача для удаления"})
    todo_id = create_response.json()["id"]

    response client.delete(f"/api/todos/{todo_id}")
    assert response.status_code == 204

    get_response = client.get(f"/api/todos/{todo_id}")
    assert get_response.status_code == 404
