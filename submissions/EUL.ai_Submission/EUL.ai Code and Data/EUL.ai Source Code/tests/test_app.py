import os
import tempfile

import pytest

from src import app


@pytest.fixture
def client():
    # db_fd, app.app.config["DATABASE"] = tempfile.mkstemp()
    app.app.config["TESTING"] = True

    with app.app.test_client() as client:
        # with app.app.app_context():
        # app.init_db()
        yield client

    # os.close(db_fd)
    # os.unlink(app.app.config["DATABASE"])


def test_index(client):
    """Start with a blank database."""

    rv = client.get("/")
    res = rv.json
    assert len(res.get("endpoints")) == 1


def test_clause_clause_text(client):
    test_clause_text = "lorem ipsum"
    rv = client.post("/clause", data=dict(text=test_clause_text))
    res = rv.json
    assert res.get("text") == test_clause_text


def test_clause_missing_clause_text(client):
    rv = client.post("/clause", data=dict())
    assert rv.status_code == 400
