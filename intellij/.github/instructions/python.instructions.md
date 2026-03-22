---
description: "Python coding standards. Use when writing or reviewing Python files, defining classes, using type hints, or applying Pythonic patterns. Triggers: Python, py, PEP8, type hints, dataclass, decorator."
applyTo: "**/*.py"
---

# Python Standards

## Style

- Follow **PEP 8** — 4-space indentation, 79-char line limit, snake_case names
- Use **type hints** on all function signatures (Python 3.10+ `X | Y` union syntax)
- Use `dataclasses` or `pydantic` models over raw dicts for structured data

## Functions & Classes

- Apply **SRP**: one function = one action; one class = one concept
- Use `@property` for computed attributes — no getter/setter boilerplate
- Prefer **composition** over inheritance; inherit only for genuine is-a relationships
- Keep functions short — extract when logic spans more than one indentation level

## Error Handling

- Catch **specific** exceptions — never bare `except:` or `except Exception:`
- Raise custom exceptions that convey intent (`UserNotFoundError` > `ValueError`)
- Use `contextlib` / `with` for resource management — never manual `try/finally` for cleanup

## Security

- Never use `eval()`, `exec()`, or `pickle` on untrusted data
- Use `subprocess` with a list argument, never shell=True with user input
- Validate all external inputs with `pydantic` validators at module boundaries

## Testing

Use **pytest** — not `unittest`.

| What to test | Tool | Notes |
|---|---|---|
| Pure functions | plain `assert` in pytest | No fixtures needed |
| Classes with dependencies | `pytest-mock` / `MagicMock` | Inject mocks via constructor |
| Repeated cases | `@pytest.mark.parametrize` | One test, many inputs |
| File system / env vars | `tmp_path` / `monkeypatch` | Built-in pytest fixtures |
| HTTP APIs (FastAPI/Flask) | `TestClient` (httpx) | Test the full request/response cycle |

```python
# Parametrize
@pytest.mark.parametrize("email,valid", [
    ("user@example.com", True),
    ("not-an-email", False),
    ("", False),
])
def test_validate_email(email: str, valid: bool) -> None:
    assert validate_email(email) is valid


# Mock external dependency
def test_get_user_raises_when_not_found(mocker: MockerFixture) -> None:
    repo = mocker.Mock(spec=UserRepository)
    repo.find_by_id.return_value = None
    service = UserService(repo)

    with pytest.raises(UserNotFoundError):
        service.get_user("unknown-id")


# FastAPI endpoint
def test_create_task_returns_201(client: TestClient) -> None:
    response = client.post("/tasks", json={"title": "Buy milk"})
    assert response.status_code == 201
    assert response.json()["title"] == "Buy milk"
```

- Use `conftest.py` for shared fixtures — never copy-paste setup code across test files
- Use `mocker.patch` (pytest-mock) over `unittest.mock.patch` — cleaner scoping
- Name test files `test_<module>.py` and functions `test_<behavior>_when_<condition>`

## Example

```python
# Bad
def process(data):
    try:
        result = eval(data["expr"])
    except:
        pass
    return result

# Good
def process(data: ProcessRequest) -> ProcessResult:
    if not data.expression.isalnum():
        raise InvalidExpressionError(f"Disallowed characters in: {data.expression!r}")
    return ProcessResult(value=calculate(data.expression))
```
