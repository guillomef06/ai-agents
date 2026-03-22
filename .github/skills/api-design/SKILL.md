---
name: api-design
description: "Design REST, GraphQL, or gRPC APIs following industry best practices. Use when creating new endpoints, defining a contract, designing resource models, versioning an API, or reviewing an existing API for consistency and usability issues. Triggers: API design, REST, GraphQL, gRPC, endpoint, HTTP, OpenAPI, versioning, pagination, error handling, API contract."
argument-hint: "API or resource to design, e.g. 'design the orders resource for an e-commerce API'"
---

# API Design

## When to Use This Skill

- Creating a new API or resource from scratch
- Reviewing an existing API for consistency issues
- Deciding how to version, paginate, or handle errors
- Choosing between REST, GraphQL, and gRPC

## REST — Quick Reference

### Resource naming

```
GET    /orders              → list orders (paginated)
GET    /orders/{id}         → get order by id
POST   /orders              → create order
PATCH  /orders/{id}         → partial update
DELETE /orders/{id}         → cancel/delete order
POST   /orders/{id}/actions/confirm   → non-CRUD action (verb as sub-resource)
```

**Rules**:
- Nouns, not verbs in paths: `/users` not `/getUsers`
- Plural collection names: `/orders` not `/order`
- Nest max 2 levels: `/orders/{id}/items`, not deeper
- Non-CRUD actions: use `POST /resource/{id}/actions/{action}`

### HTTP status codes (must-know)

| Code | Use |
|------|-----|
| 200 | Success with body |
| 201 | Resource created (include `Location` header) |
| 204 | Success, no body |
| 400 | Client validation error (include error detail) |
| 401 | Not authenticated |
| 403 | Authenticated but not authorized |
| 404 | Resource not found |
| 409 | Conflict (duplicate, optimistic lock) |
| 422 | Unprocessable entity (semantic validation) |
| 429 | Rate limit exceeded (include `Retry-After`) |
| 500 | Server error (never expose stack traces) |

### Pagination

Prefer cursor-based for large datasets; offset for simple admin UIs:
```json
{
  "data": [...],
  "pagination": {
    "cursor": "eyJpZCI6MTAwfQ==",
    "hasNextPage": true,
    "pageSize": 20
  }
}
```

### Error response shape

Always return structured errors — never raw exception messages:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": [
      { "field": "email", "issue": "Must be a valid email address" }
    ]
  }
}
```

## Versioning

- URI versioning (`/v1/`) for public APIs with breaking changes
- Header versioning (`Accept: application/vnd.api+json;version=2`) for internal APIs
- Never break existing clients — add, don't remove

## Detailed Guides

See [GraphQL guidelines](./references/graphql.md) | [gRPC guidelines](./references/grpc.md) | [security checklist](./references/api-security.md)
