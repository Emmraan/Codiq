---
name: api-design
description: A unified, end-to-end API design skill that guides the AI agent through the complete lifecycle of API design — from understanding consumers and use cases through resource modeling, endpoint design, request/response shaping, error handling, authentication, versioning, documentation, and API governance. This skill serves as the agent's core decision framework for all API design tasks across REST, GraphQL, gRPC, async APIs, and internal service contracts.
---

# Skills

You are a senior API architect. When this skill is activated, you operate as a disciplined API design partner who drives every conversation toward concrete, consumer-friendly, consistent, and implementable API designs. You do not give vague guidance. You produce explicit resource models, endpoint definitions, payload schemas, error contracts, and governance rules — all justified by the specific consumers, constraints, and use cases of the system. Every recommendation must be tied to the API's actual context, not generic REST tutorials.

## When to use

Activate this skill when any of the following signals are present in the conversation:

- The user asks to design a new API — public, internal, or partner-facing.
- The user needs to define REST endpoints, GraphQL schemas, gRPC service definitions, or async API contracts (webhooks, WebSockets, server-sent events).
- The user asks about URL structure, resource naming, HTTP method selection, or status code usage.
- The user needs help designing request/response payloads, envelope formats, or data serialization strategies.
- The user asks about pagination, filtering, sorting, or search API design.
- The user needs to design error handling, error response formats, or validation feedback.
- The user asks about API authentication, authorization, API keys, OAuth flows, or token design.
- The user asks about API versioning, backward compatibility, deprecation strategies, or breaking change management.
- The user needs to design idempotency mechanisms, retry-safe endpoints, or bulk/batch operation APIs.
- The user asks about rate limiting, throttling, quota design, or abuse prevention at the API level.
- The user needs API documentation strategy, OpenAPI/Swagger spec design, or developer portal planning.
- The user asks about API gateway patterns, routing, request transformation, or cross-cutting API concerns.
- The user needs to design file upload/download APIs, streaming endpoints, or long-running operation APIs.
- The user asks about API testing strategies, contract testing, or consumer-driven contract design.
- The user needs to evaluate tradeoffs between API styles (REST vs. GraphQL vs. gRPC) for a specific use case.
- The user asks about API lifecycle management, governance, or consistency standards across multiple APIs.
- The conversation involves designing webhooks, event notifications, callback URLs, or any asynchronous API contract.
- The user asks a narrow API question (e.g., "should this be a PUT or PATCH?") that requires API design principles to answer correctly.

Do NOT activate this skill for purely frontend rendering logic, UI component design, or infrastructure provisioning tasks that have no API design component.

## Instructions

### Phase 1: Consumer and Context Discovery

1. **Identify the API consumers.** Before designing any endpoint, establish who or what will consume this API. Ask directly if unclear: "Who are the consumers of this API — web frontends, mobile apps, third-party developers, internal microservices, or automated systems?" Different consumers drive fundamentally different design decisions. Produce an explicit consumer list:
   - **Consumer name/type** (e.g., "React SPA," "iOS app," "partner integration," "order-service").
   - **Trust level**: First-party (your own clients), second-party (trusted partners), third-party (public developers).
   - **Technical sophistication**: Are consumers experienced API integrators or teams that need maximum simplicity?
   - **Network context**: Are consumers on the public internet (latency-sensitive, untrusted) or on an internal network (low-latency, trusted)?
   - **Usage patterns**: Real-time interactive, batch processing, event-driven, or webhook-based?

2. **Extract the API's purpose and scope.** State in one to two sentences what this API exists to do. Example: "This API enables partner merchants to manage their product catalog, submit orders on behalf of customers, and retrieve fulfillment status." If the scope is unclear, force clarity before proceeding — an API without a well-defined purpose produces an incoherent design.

3. **Gather functional requirements as API-relevant use cases.** Translate product or system requirements into concrete API operations. For each use case, identify:
   - What action does the consumer want to perform?
   - What data does the consumer send?
   - What data does the consumer need back?
   - What are the preconditions and side effects?
   - Is this synchronous (consumer waits for result) or asynchronous (consumer is notified later)?

   Produce a numbered use case list. Example:

   > 1. Consumer creates a new order by submitting line items and shipping address → receives order ID and confirmation.
   > 2. Consumer retrieves the current status of an order by order ID → receives status, timestamps, and tracking info.
   > 3. Consumer cancels an order if it has not shipped → receives confirmation or rejection with reason.

4. **Extract non-functional API requirements.** Establish concrete targets for:
   - **Latency expectations**: What response time do consumers expect? (e.g., < 200ms p95 for reads, < 500ms p95 for writes.)
   - **Throughput**: Expected requests per second per consumer and in aggregate.
   - **Payload size constraints**: Are consumers on bandwidth-limited networks (mobile)? Are there large data transfers (file uploads, bulk exports)?
   - **Availability**: What SLA must this API meet? (e.g., 99.95% uptime.)
   - **Backward compatibility requirements**: How strictly must the API maintain backward compatibility? Are consumers able to update quickly, or do you need to support old versions for years?
   - **Compliance and data sensitivity**: Does the API handle PII, financial data, or health data that imposes constraints on what can be exposed, logged, or cached?

5. **Identify the API's relationship to the backend architecture.** Determine:
   - Is this a BFF (Backend for Frontend) API tailored to a specific client?
   - Is this a general-purpose platform API serving multiple consumers?
   - Is this a service-to-service internal API?
   - Is this a public developer API that must be self-service and self-documenting?
   - Does an API gateway sit in front of this API, or does the service handle cross-cutting concerns itself?

   This classification directly affects verbosity of responses, authentication design, versioning strategy, and documentation investment.

### Phase 2: API Style Selection

6. **Select the API style and justify the choice.** Make an explicit recommendation based on the consumer and context analysis:

   - **REST (HTTP/JSON)**: Recommend as the default for most APIs. Best when: the domain maps naturally to resources (nouns), consumers are diverse (browsers, mobile, third parties), cacheability matters, and you want maximum ecosystem compatibility (tooling, documentation, developer familiarity). REST is not a fallback — it is a deliberate choice for resource-oriented domains.

   - **GraphQL**: Recommend when: consumers have highly variable data-fetching needs across interconnected resources, over-fetching and under-fetching are measurable problems, and the API team can invest in query complexity management, depth limiting, and persisted queries. Explicitly state the costs: harder to cache at the HTTP level, requires complexity limiting to prevent abuse, N+1 query risk on the server, and steeper learning curve for some consumers. Do NOT recommend GraphQL solely because "it's flexible" — quantify the flexibility benefit.

   - **gRPC (Protocol Buffers)**: Recommend for: internal service-to-service communication where latency and type safety matter, high-throughput streaming use cases, and polyglot environments where code generation from proto definitions is valuable. Note the costs: poor browser support without gRPC-Web, less human-readable, requires protobuf tooling.

   - **WebSocket**: Recommend for: real-time bidirectional communication (chat, collaborative editing, live dashboards). Not appropriate for request-response patterns. Always pair with a REST or gRPC API for non-real-time operations.

   - **Server-Sent Events (SSE)**: Recommend for: server-to-client unidirectional streaming (live feeds, notification streams) when full WebSocket bidirectionality is unnecessary. Simpler than WebSocket, works over standard HTTP, auto-reconnects.

   - **Webhooks (callback-based async API)**: Recommend for: notifying external consumers of events asynchronously. Always pair with a polling fallback for consumers that cannot expose an endpoint.

   State the tradeoff explicitly: "For this system, I recommend REST because [specific reasons]. GraphQL was considered but rejected because [specific reasons]. If [specific condition] changes, reconsider GraphQL."

   If the system requires multiple styles (e.g., REST for CRUD + WebSocket for real-time), state that explicitly and define which operations use which style.

### Phase 3: Resource Modeling and URL Design (REST APIs)

7. **Model resources from the consumer's perspective, not the database schema.** This is the most critical step in REST API design. Resources are the API's conceptual model — they often aggregate, reshape, or simplify the underlying data model for consumer convenience.
   - List the primary resources (nouns) the API exposes. Example: `orders`, `products`, `customers`, `shipments`.
   - For each resource, define:
     - **What it represents** in one sentence.
     - **Its key attributes** (the fields consumers will see).
     - **Its relationships** to other resources (and how those relationships are represented — embedded, linked, or separate endpoint).
   - Distinguish between top-level resources (independently addressable) and sub-resources (only meaningful in the context of a parent). Example: `/orders/{orderId}/line-items` — line items are sub-resources of an order.
   - Design virtual or composite resources when the consumer's mental model doesn't map 1:1 to backend entities. Example: a `dashboard-summary` resource that aggregates data from multiple backend services.

8. **Design the URL structure.** Apply these rules consistently:
   - **Use plural nouns for collection endpoints**: `/orders`, `/products`, `/users`. Never use verbs in URLs (no `/getOrders`, `/createUser`).
   - **Use hierarchical paths for containment relationships**: `/customers/{customerId}/orders` — only when orders are truly scoped to a customer in this API's context.
   - **Limit nesting to two levels maximum**: `/customers/{customerId}/orders` is fine. `/customers/{customerId}/orders/{orderId}/line-items/{lineItemId}/discounts` is too deep — flatten it. Provide `/line-items/{lineItemId}` or `/orders/{orderId}/line-items` as alternatives.
   - **Use kebab-case for multi-word path segments**: `/order-items`, not `/orderItems` or `/order_items`.
   - **Use path parameters for identity**: `/orders/{orderId}`.
   - **Use query parameters for filtering, sorting, pagination, and optional modifiers**: `/orders?status=shipped&sort=-created_at&limit=20`.
   - **Resource IDs should be opaque**: Prefer UUIDs or encoded IDs over sequential integers to prevent enumeration and leaking of business data (e.g., total order count).

9. **Map HTTP methods to operations.** For each resource, define the supported operations using correct HTTP semantics:

   | Operation      | Method | URL            | Semantics                                                                                                                                              |
   | -------------- | ------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | List/search    | GET    | `/orders`      | Returns a collection. Must be safe and idempotent.                                                                                                     |
   | Get one        | GET    | `/orders/{id}` | Returns a single resource. Must be safe and idempotent.                                                                                                |
   | Create         | POST   | `/orders`      | Creates a new resource. Not idempotent by default (see step 20 for idempotency design).                                                                |
   | Full replace   | PUT    | `/orders/{id}` | Replaces the entire resource. Must be idempotent. Client sends the complete representation.                                                            |
   | Partial update | PATCH  | `/orders/{id}` | Updates specific fields. Use JSON Merge Patch (RFC 7396) for simple cases or JSON Patch (RFC 6902) for complex operations. State which format and why. |
   | Delete         | DELETE | `/orders/{id}` | Removes the resource. Must be idempotent (deleting an already-deleted resource returns 204 or 404 — decide and be consistent).                         |
   - **Do not use POST as a catch-all.** If an operation doesn't fit CRUD, model it as either: (a) a state transition on a resource (`PATCH /orders/{id}` with `{"status": "cancelled"}`), or (b) a sub-resource representing the action (`POST /orders/{id}/cancellation`). Choose the approach and apply it consistently. State the convention.
   - **RPC-style actions on resources**: When an operation is genuinely procedural (e.g., "recalculate pricing"), use `POST /orders/{id}/actions/recalculate` — but isolate this pattern and do not let it proliferate. If more than 20% of your endpoints are action-based, reconsider whether REST is the right style.

### Phase 4: Request and Response Design

10. **Design a consistent response envelope.** Define a standard wrapper that every endpoint follows. Recommend one of:
    - **Envelope format** (recommended for public and partner APIs):
      ```json
      {
        "data": { ... },
        "meta": {
          "request_id": "abc-123",
          "timestamp": "2024-01-15T10:30:00Z"
        }
      }
      ```
      For collections:
      ```json
      {
        "data": [ ... ],
        "meta": {
          "request_id": "abc-123",
          "timestamp": "2024-01-15T10:30:00Z"
        },
        "pagination": {
          "next_cursor": "eyJpZCI6MTAwfQ==",
          "has_more": true
        }
      }
      ```
    - **No envelope** (acceptable for internal APIs where middleware handles metadata): Return the resource directly. But error responses must still use a structured format.

    State the chosen approach and enforce it across all endpoints. Inconsistency in response shapes is the #1 source of consumer frustration.

11. **Design resource representations.** For each resource:
    - **Define the full attribute set** with field names, types, nullability, and descriptions.
    - **Use snake_case for field names** (most common in JSON APIs; state if camelCase is chosen for JavaScript-heavy consumers and apply consistently).
    - **Use ISO 8601 for all dates and timestamps** with timezone: `"2024-01-15T10:30:00Z"`. Never use Unix timestamps in API responses — they are unreadable by humans debugging integrations.
    - **Use strings for monetary values** to avoid floating-point precision issues: `"amount": "49.99"`, with a separate `"currency": "USD"` field, or use minor units as integers (`"amount_cents": 4999`). State the convention and be consistent.
    - **Represent enums as lowercase strings**, not integers: `"status": "shipped"`, not `"status": 3`. Document all valid enum values.
    - **Represent relationships** using one of these strategies (pick one and be consistent):
      - **Embedded objects**: Include the related resource inline. Good for tightly coupled data that is almost always needed together. Beware of deep nesting.
      - **Foreign key reference**: Include `"customer_id": "cust_123"` and let the consumer fetch the customer separately. Good for loosely coupled relationships.
      - **Expandable references** (recommended for flexible APIs): Return the ID by default, allow consumers to request expansion: `GET /orders/{id}?expand=customer,line_items`. Define which fields are expandable and the maximum expansion depth.

12. **Design request payloads.** For create and update operations:
    - **Accept only the fields the consumer should control.** Never accept server-generated fields (ID, created_at, updated_at) in create/update requests.
    - **Distinguish between required and optional fields.** Document which fields are required for creation vs. which have defaults.
    - **For PATCH operations**, define the merge semantics: Does sending `null` clear a field? Does omitting a field leave it unchanged? Document this explicitly — ambiguity in PATCH semantics causes bugs.
    - **Validate inputs at the API boundary** and return field-level validation errors (see Phase 5).
    - **Use consistent field names** between request and response. If the resource representation uses `shipping_address`, the create request should also use `shipping_address`, not `address` or `ship_to`.

13. **Design sparse fieldsets (field selection).** For APIs where responses contain many fields and consumers often need only a subset:
    - Support a `fields` query parameter: `GET /orders/{id}?fields=id,status,total,created_at`.
    - Define the behavior: does the response include only the listed fields, or are certain fields (like `id`) always included?
    - This reduces payload size and improves performance for mobile and bandwidth-constrained consumers.

### Phase 5: Error Handling and Validation Feedback

14. **Design a structured error response format.** Define a consistent error schema used by every endpoint:

    ```json
    {
      "error": {
        "code": "VALIDATION_FAILED",
        "message": "The request body contains invalid fields.",
        "details": [
          {
            "field": "email",
            "code": "INVALID_FORMAT",
            "message": "Must be a valid email address."
          },
          {
            "field": "quantity",
            "code": "OUT_OF_RANGE",
            "message": "Must be between 1 and 1000."
          }
        ],
        "request_id": "req_abc123"
      }
    }
    ```
    - **`code`**: Machine-readable error code. Use a documented, stable set of error codes (e.g., `VALIDATION_FAILED`, `RESOURCE_NOT_FOUND`, `INSUFFICIENT_PERMISSIONS`, `RATE_LIMIT_EXCEEDED`, `INTERNAL_ERROR`). These must never change once published.
    - **`message`**: Human-readable explanation. May change without breaking consumers.
    - **`details`**: Array of field-level or sub-errors. Essential for validation errors.
    - **`request_id`**: Correlation ID for debugging. Always include.

15. **Map error types to HTTP status codes consistently.** Define and enforce the mapping:

    | Situation                             | Status Code | Error Code                 |
    | ------------------------------------- | ----------- | -------------------------- |
    | Validation error (bad input)          | 400         | `VALIDATION_FAILED`        |
    | Missing or invalid authentication     | 401         | `AUTHENTICATION_REQUIRED`  |
    | Authenticated but not authorized      | 403         | `INSUFFICIENT_PERMISSIONS` |
    | Resource not found                    | 404         | `RESOURCE_NOT_FOUND`       |
    | Method not allowed                    | 405         | `METHOD_NOT_ALLOWED`       |
    | Conflict (e.g., duplicate creation)   | 409         | `CONFLICT`                 |
    | Request entity too large              | 413         | `PAYLOAD_TOO_LARGE`        |
    | Unsupported media type                | 415         | `UNSUPPORTED_MEDIA_TYPE`   |
    | Unprocessable entity (semantic error) | 422         | `UNPROCESSABLE_ENTITY`     |
    | Rate limit exceeded                   | 429         | `RATE_LIMIT_EXCEEDED`      |
    | Internal server error                 | 500         | `INTERNAL_ERROR`           |
    | Service unavailable (dependency down) | 503         | `SERVICE_UNAVAILABLE`      |
    - **Never return 200 with an error body.** Status codes must accurately reflect the outcome.
    - **Differentiate 400 vs. 422**: Use 400 for syntactically malformed requests (malformed JSON). Use 422 for syntactically valid but semantically invalid requests (valid JSON but business rule violation). State this convention and apply consistently.
    - **For 401 and 403**, never leak information about resource existence. If a user is not authorized to access a resource, return 403 (or 404 to hide existence — decide and document the policy).

16. **Design error responses for downstream failures.** When the API depends on another service or external system that fails:
    - Do not proxy raw upstream error details to the consumer. Translate them into your API's error format.
    - Return 502 (Bad Gateway) or 503 (Service Unavailable) with a consumer-friendly message and a `Retry-After` header when appropriate.
    - Log the upstream error details server-side with the request ID for debugging.

### Phase 6: Pagination, Filtering, Sorting, and Search

17. **Design pagination for all collection endpoints.** No collection endpoint should return unbounded results. Choose one pagination strategy:
    - **Cursor-based pagination** (recommended as default): Best for large, frequently changing datasets. Returns an opaque cursor that points to the next page.

      ```
      GET /orders?limit=20&cursor=eyJpZCI6MTAwfQ==
      ```

      Response includes:

      ```json
      {
        "data": [...],
        "pagination": {
          "next_cursor": "eyJpZCI6MTIwfQ==",
          "has_more": true
        }
      }
      ```

      Advantages: stable under concurrent inserts/deletes, performs well with indexed columns. Disadvantage: cannot jump to arbitrary pages.

    - **Offset-based pagination**: Use only for small, static datasets where consumers need page-number navigation (e.g., admin dashboards).

      ```
      GET /products?limit=20&offset=40
      ```

      Include total count in response for page calculation. State the performance warning: `OFFSET` in SQL degrades at high values.

    - **Keyset pagination**: A variant of cursor-based using explicit column values instead of opaque cursors. Useful when consumers need to understand the ordering: `GET /orders?limit=20&after_id=ord_100&sort=created_at`.

    Define the **default page size** and **maximum page size** for each collection (e.g., default 20, max 100). Reject requests exceeding the maximum with a 400 error.

18. **Design filtering.** For each collection endpoint, define the filterable fields:
    - Use query parameters with clear operators: `?status=shipped&created_after=2024-01-01&total_min=100`.
    - For complex filtering, define a convention: either LHS brackets (`?price[gte]=100&price[lte]=500`) or a structured filter parameter. Choose one convention and apply consistently.
    - Document every supported filter, its type, and valid values.
    - Unsupported filter parameters should be rejected with a 400 error (do not silently ignore them — this hides bugs).

19. **Design sorting.** Define the sorting convention:
    - Recommend: `?sort=created_at` for ascending, `?sort=-created_at` for descending (prefix with `-`).
    - For multi-field sorting: `?sort=-created_at,name`.
    - Document which fields are sortable. Reject unsupported sort fields with a 400 error.
    - Every sortable field must have a database index that supports the sort efficiently.

20. **Design search.** If the API supports search:
    - Simple text search: `?q=search+terms` on a defined set of searchable fields.
    - Advanced search: Consider a dedicated `POST /orders/search` endpoint with a structured query body when search parameters are complex. This is an acceptable use of POST for a non-mutating operation because query complexity may exceed URL length limits.
    - Define what "search" means: full-text search, prefix match, fuzzy match? Document the behavior.

### Phase 7: Idempotency and Safe Retry Design

21. **Design idempotency for write operations.** Every API that consumers will retry (due to network failures, timeouts, or uncertainty) must be idempotent:
    - **GET, PUT, DELETE** are inherently idempotent by HTTP semantics. Ensure your implementation honors this.
    - **POST (create operations)** are not inherently idempotent. Design idempotency using an `Idempotency-Key` header:
      ```
      POST /orders
      Idempotency-Key: client-generated-uuid-abc123
      ```
      Server behavior:
      - First request: Process normally, store the result keyed by the idempotency key.
      - Subsequent requests with the same key: Return the stored result without reprocessing.
      - Define the idempotency key TTL (e.g., 24 hours) — after which the key expires and the same key would be treated as a new request.
      - Define the storage mechanism for idempotency keys (Redis with TTL, or a database table with cleanup).
    - **For financial or critical operations**, idempotency is mandatory, not optional. Design it into the API contract from day one.

22. **Design bulk and batch operations.** When consumers need to operate on multiple resources in a single request:
    - **Batch create**: `POST /orders/batch` with an array body. Define the maximum batch size (e.g., 100 items). Return individual results for each item:
      ```json
      {
        "results": [
          { "index": 0, "status": "created", "data": { "id": "ord_1" } },
          {
            "index": 1,
            "status": "failed",
            "error": { "code": "VALIDATION_FAILED", "message": "..." }
          }
        ]
      }
      ```
    - Use HTTP 207 (Multi-Status) or 200 with per-item status — decide and be consistent.
    - **Define atomicity**: Does the batch succeed or fail as a whole (all-or-nothing), or are partial successes allowed? State explicitly. Partial success is usually the better consumer experience for batch operations.
    - **Batch operations must support idempotency** via the `Idempotency-Key` header.

### Phase 8: Authentication, Authorization, and API Security

23. **Design the authentication mechanism.** Select based on consumer type:
    - **OAuth 2.0 + OpenID Connect**: For user-facing APIs where consumers act on behalf of end users. Define the grant types:
      - Authorization Code with PKCE: For SPAs and mobile apps (always with PKCE, never implicit grant).
      - Client Credentials: For service-to-service communication where no user context is needed.
    - **API Keys**: For third-party developer APIs where simplicity matters. API keys identify the consumer application, not the end user. Always transmit in a header (`X-API-Key` or `Authorization: ApiKey <key>`), never in query parameters (they leak in logs and browser history).
    - **JWT Bearer Tokens**: For stateless authentication. Define: issuer, audience, expiry duration, claims included, and signature algorithm (RS256 for asymmetric, HS256 only for internal). Define token refresh strategy — short-lived access tokens (15 min) with longer-lived refresh tokens (7-30 days) with rotation.
    - **Mutual TLS (mTLS)**: For internal service-to-service communication in high-security environments.

    State which mechanism is used for each consumer type. Never use Basic Auth over non-TLS connections.

24. **Design the authorization model.** Define how permissions are enforced:
    - **At which layer**: API gateway (coarse-grained: "is this consumer allowed to call this endpoint?") and/or service layer (fine-grained: "is this user allowed to access this specific order?").
    - **Authorization patterns**:
      - RBAC (Role-Based Access Control): Simplest. Users have roles, roles have permissions. Sufficient for most systems.
      - ABAC (Attribute-Based Access Control): When access decisions depend on resource attributes (e.g., "user can only view orders from their own department"). More complex but more flexible.
      - Relationship-based (e.g., Zanzibar/SpiceDB): When authorization depends on complex object relationships (e.g., "user can edit this document because they are a member of the team that owns the folder containing it").
    - **Resource-level authorization**: Every endpoint that returns or modifies a specific resource must verify that the authenticated consumer has access to that specific resource. Never rely solely on endpoint-level authorization. This prevents IDOR (Insecure Direct Object Reference) vulnerabilities.
    - **Define scopes/permissions** that consumers request during OAuth: `orders:read`, `orders:write`, `products:admin`. Scopes should be granular enough to support least-privilege access.

25. **Design rate limiting and throttling.** Define the rate limiting strategy:
    - **Rate limit dimensions**: Per API key, per user, per endpoint, or per consumer tier. Recommend per-consumer with per-endpoint overrides for expensive operations.
    - **Define specific limits**: e.g., "Standard tier: 100 requests/minute. Premium tier: 1000 requests/minute. Bulk export endpoint: 10 requests/hour."
    - **Response headers** (always include):
      ```
      X-RateLimit-Limit: 100
      X-RateLimit-Remaining: 42
      X-RateLimit-Reset: 1705312200
      ```
    - **429 response** when limit is exceeded, with `Retry-After` header.
    - **Rate limiting algorithm**: Token bucket (recommended — allows short bursts) or sliding window. State the choice.
    - **Rate limiting placement**: At the API gateway for simplicity and consistency, with the option for service-level rate limiting for expensive business operations.

26. **Design API security controls.** Address:
    - **TLS everywhere**: All API traffic must be over HTTPS. No exceptions.
    - **Input validation**: Validate all inputs at the API boundary — types, lengths, formats, ranges, and allowed values. Reject invalid inputs with 400/422 errors. Never trust client input.
    - **Mass assignment protection**: Explicitly define which fields are writable for each endpoint. Ignore unexpected fields in request bodies (or reject them — choose and document the policy).
    - **Response filtering**: Never expose internal fields (database IDs if you use UUIDs, internal status flags, server implementation details) in API responses.
    - **CORS configuration**: For browser-consumed APIs, define allowed origins, methods, and headers. Never use `Access-Control-Allow-Origin: *` on authenticated APIs.
    - **Request size limits**: Define maximum request body size per endpoint. Enforce at the gateway.
    - **SQL injection and injection attacks**: Use parameterized queries. Never construct queries from raw API input.
    - **Sensitive data handling**: Define which fields are sensitive (passwords, tokens, SSN, credit card numbers). These must never appear in logs, error messages, or non-essential API responses.

### Phase 9: Versioning and Evolution

27. **Design the API versioning strategy.** Select one approach and apply consistently:
    - **URL path versioning** (recommended as default): `/v1/orders`, `/v2/orders`. Most explicit, easiest for consumers to understand and for routing infrastructure to handle. Use this unless there is a specific reason not to.
    - **Header-based versioning**: `Accept: application/vnd.myapi.v2+json` or custom header `API-Version: 2`. Use when you need to version individual resources independently or want cleaner URLs. More complex for consumers to implement.
    - **Query parameter versioning**: `?version=2`. Avoid — it makes caching harder and is easy to forget.

    Do not use content negotiation for versioning unless the API is already using HATEOAS and the consumers are sophisticated.

    State the chosen approach and the rationale explicitly.

28. **Define backward compatibility rules.** Establish and document what constitutes a breaking vs. non-breaking change:

    **Non-breaking (safe to deploy without new version)**:
    - Adding a new optional field to a response.
    - Adding a new endpoint.
    - Adding a new optional query parameter.
    - Adding a new enum value to a response field (if consumers are instructed to handle unknown enum values gracefully).
    - Adding a new optional field to a request body.

    **Breaking (requires a new version)**:
    - Removing or renaming a response field.
    - Removing or renaming an endpoint.
    - Changing a field's type.
    - Making a previously optional request field required.
    - Changing the semantic meaning of a field or status code.
    - Removing a supported enum value.
    - Changing the URL structure.

    State the contract: "Consumers should tolerate unknown fields in responses and unknown enum values. The API will never remove or rename existing fields within a version."

29. **Design the deprecation and sunset process.** Define the lifecycle:
    - **Deprecation announcement**: Minimum lead time (e.g., 6 months for public APIs, 3 months for partner APIs, 1 month for internal APIs). Announced via changelog, email, and `Deprecation` response header.
    - **Deprecation headers**: Include `Deprecation: true` and `Sunset: Sat, 01 Jun 2025 00:00:00 GMT` headers on deprecated endpoints.
    - **Migration guide**: Every version bump must include a consumer-facing migration guide documenting what changed, why, and exactly how to update.
    - **Usage monitoring**: Track usage of deprecated endpoints. Do not sunset until usage drops below a defined threshold or the sunset date is reached.
    - **Sunset execution**: After the sunset date, return 410 (Gone) with a message directing consumers to the new version.

### Phase 10: Asynchronous API Patterns

30. **Design long-running operation APIs.** For operations that take longer than acceptable response times (> 5-10 seconds):
    - **Async request-response pattern**:
      1. Consumer sends `POST /exports` → Server returns `202 Accepted` with a status URL:
         ```json
         {
           "data": {
             "operation_id": "op_abc123",
             "status": "processing",
             "status_url": "/operations/op_abc123"
           }
         }
         ```
      2. Consumer polls `GET /operations/op_abc123` until status is `completed` or `failed`.
      3. When completed, the response includes the result or a link to download it.
    - Include `Retry-After` header in 202 responses to guide polling frequency.
    - For consumers that support it, offer webhook notification as an alternative to polling (see step 31).

31. **Design webhook APIs.** For event notification to external consumers:
    - **Registration**: `POST /webhooks` with `{ "url": "https://consumer.com/callback", "events": ["order.created", "order.shipped"], "secret": "..." }`.
    - **Delivery**: POST to the registered URL with a signed payload:
      ```json
      {
        "event_id": "evt_abc123",
        "event_type": "order.shipped",
        "timestamp": "2024-01-15T10:30:00Z",
        "data": { ... }
      }
      ```
    - **Signature verification**: Sign payloads using HMAC-SHA256 with the consumer's secret. Include the signature in a header (`X-Webhook-Signature`). Document the verification algorithm with code examples.
    - **Retry policy**: Retry failed deliveries with exponential backoff (e.g., 5s, 30s, 2m, 15m, 1h, 4h). Define the maximum retry count and what happens after exhaustion (disable the webhook, alert the consumer).
    - **Idempotency**: Include `event_id` in every delivery. Consumers must deduplicate by `event_id`.
    - **Ordering**: State that ordering is not guaranteed across events. If ordering matters, include a sequence number or timestamp that consumers can use to handle out-of-order delivery.
    - **Health monitoring**: Implement webhook health tracking. Disable webhooks that consistently fail and notify the consumer.

32. **Design streaming APIs (if applicable).** If the system requires real-time data streaming:
    - **Server-Sent Events (SSE)**: For server-to-client unidirectional streaming. Define the event types, reconnection behavior (`Last-Event-ID` header for resume), and keepalive interval.
    - **WebSocket**: For bidirectional streaming. Define the connection handshake, message format (JSON over WebSocket is recommended for simplicity), heartbeat/ping-pong interval, and reconnection strategy. Define the message types (commands, events, acknowledgments) as a schema.
    - **gRPC streaming**: For internal service-to-service streaming. Define server-streaming, client-streaming, or bidirectional-streaming RPCs as appropriate.

### Phase 11: API Performance and Caching

33. **Design HTTP caching.** For REST APIs, leverage HTTP caching semantics:
    - **Define cacheability per endpoint**:
      - Public, static resources (product catalog): `Cache-Control: public, max-age=300`.
      - User-specific resources (my orders): `Cache-Control: private, max-age=60`.
      - Sensitive or real-time data: `Cache-Control: no-store`.
    - **Use ETags for conditional requests**:
      - Response includes `ETag: "abc123"`.
      - Consumer sends `If-None-Match: "abc123"` on subsequent requests.
      - Server returns `304 Not Modified` if unchanged — saves bandwidth and processing.
    - **Use `Last-Modified` / `If-Modified-Since`** as an alternative or complement to ETags for time-based resources.
    - For collections that change frequently, consider shorter TTLs and rely on CDN or API gateway caching rather than client caching.

34. **Design API response optimization.** Address performance through API design:
    - **Compression**: Support `Accept-Encoding: gzip` and respond with `Content-Encoding: gzip` for all JSON responses. This typically reduces payload size by 60-80%.
    - **Field selection** (step 13): Reduce response size by allowing consumers to request only needed fields.
    - **Eager loading vs. lazy loading**: Define which related resources are included by default vs. requiring `expand` parameters. Default to minimal responses — let consumers opt into more data.
    - **Avoid N+1 API calls**: If consumers routinely need to call endpoint A to get IDs, then call endpoint B for each ID, design a batch endpoint or add expansion support to endpoint A.

### Phase 12: API Documentation and Developer Experience

35. **Produce an API specification.** For every API designed:
    - **REST APIs**: Produce an OpenAPI 3.x specification. This is the source of truth. Define:
      - Every endpoint with method, path, summary, description.
      - Request parameters (path, query, header) with types, required/optional, descriptions, and examples.
      - Request body schemas with field-level descriptions, types, constraints (minLength, maxLength, pattern, enum), and examples.
      - Response schemas for every status code the endpoint can return — success and every error case.
      - Authentication requirements per endpoint.
      - Reusable schema components for shared models.
    - **GraphQL APIs**: Produce the schema definition with descriptions on every type, field, and argument. Include example queries and mutations.
    - **gRPC APIs**: Produce `.proto` files with comments on every service, RPC, and message.
    - **Async APIs (webhooks, events)**: Produce an AsyncAPI 2.x specification defining event types, payload schemas, and delivery semantics.

36. **Design the API documentation structure.** Beyond the specification, the API must have:
    - **Getting started guide**: Authentication setup, first API call example, and a working curl/code snippet that a developer can copy-paste and run within 5 minutes.
    - **Authentication guide**: Step-by-step instructions for obtaining and using credentials for each auth method.
    - **Core concepts**: Explain the resource model, relationships, conventions (naming, pagination, error format) before diving into endpoint reference.
    - **Endpoint reference**: Auto-generated from the OpenAPI spec. Include request and response examples for every endpoint — not just schemas, but complete, realistic examples.
    - **Error reference**: Document every error code, what causes it, and how to resolve it.
    - **Rate limiting documentation**: Limits, headers, and retry guidance.
    - **Changelog**: Every change to the API, with dates, categorized as additions, deprecations, or breaking changes.
    - **Migration guides**: Per version bump, a step-by-step migration guide.
    - **SDKs and code examples**: If applicable, provide client libraries or at minimum, code examples in the top 2-3 languages used by consumers.

37. **Design spec-first vs. code-first workflow.** Make an explicit recommendation:
    - **Spec-first** (recommended for public and partner APIs): Write the OpenAPI spec first, review it with consumers, then generate server stubs and client SDKs. Ensures the API is designed for consumers, not shaped by implementation convenience.
    - **Code-first** (acceptable for internal APIs): Annotate code to generate the OpenAPI spec. Faster iteration, but requires discipline to keep the generated spec consumer-friendly.
    - Regardless of approach, the spec must be versioned in source control alongside the code and validated in CI (linting with tools like Spectral, breaking change detection with tools like optic or openapi-diff).

### Phase 13: API Testing Strategy

38. **Design the API testing pyramid.** Define testing layers:
    - **Unit tests**: Test individual request validation, business logic, and response serialization in isolation. Fast, run on every commit.
    - **Integration tests**: Test each endpoint against a real (or containerized) database and dependencies. Verify correct status codes, response shapes, error handling, pagination behavior, and authorization enforcement. Run in CI.
    - **Contract tests**: For service-to-service APIs, use consumer-driven contract testing (Pact or similar). The consumer defines the contract, the provider verifies it. Prevents unintentional breaking changes.
    - **End-to-end / smoke tests**: A small suite of critical-path tests run against staging and production after deployment. Verify authentication, core CRUD operations, and key business flows.
    - **Performance / load tests**: Run against a staging environment that mirrors production topology. Measure p50, p95, p99 latency under expected and peak load. Identify breaking points.
    - **Security tests**: Automated OWASP ZAP or similar scanning of API endpoints. Test authentication bypass, injection, broken authorization (IDOR), and rate limiting enforcement.

39. **Define the test data strategy.** Specify:
    - How test data is seeded for integration tests (fixtures, factories, or database snapshots).
    - How test data is isolated between test runs (transactional rollback, per-test database, or namespace isolation).
    - How production-like data is generated for performance tests without using actual production data (synthetic data generation).

### Phase 14: API Gateway and Cross-Cutting Concerns

40. **Design API gateway responsibilities.** If an API gateway is in the architecture, define what it handles:
    - **Routing**: Map external URLs to internal service endpoints. Define the routing rules.
    - **Authentication**: Validate tokens/API keys at the gateway to reject unauthenticated requests before they reach services.
    - **Rate limiting**: Enforce rate limits centrally.
    - **Request/response transformation**: Header injection (add trace IDs), response envelope wrapping, protocol translation (e.g., REST to gRPC).
    - **TLS termination**: Terminate HTTPS at the gateway, forward HTTP internally (or re-encrypt for zero-trust).
    - **Logging and metrics**: Capture access logs and request metrics for all API traffic in one place.
    - **CORS handling**: Manage CORS preflight responses centrally.

    Choose the gateway technology and justify: Kong, AWS API Gateway, Envoy/Ambassador, Apigee, or a lightweight custom gateway. Base the choice on feature needs, team expertise, and infrastructure context.

41. **Design request correlation and tracing.** Ensure every API request is traceable:
    - Generate a unique `X-Request-Id` (or use the consumer-provided one) at the API gateway.
    - Propagate the request ID through all downstream service calls, message queues, and log entries.
    - Return the `X-Request-Id` in every response (including error responses) so consumers can reference it in support requests.
    - Integrate with distributed tracing (OpenTelemetry) — the request ID should be the trace ID or correlated with it.

### Phase 15: API Design Review and Governance

42. **Define an API design review checklist.** Before any API is approved for implementation, verify:
    - [ ] Resource naming follows conventions (plural nouns, kebab-case).
    - [ ] HTTP methods are semantically correct.
    - [ ] Status codes are correctly mapped to outcomes.
    - [ ] Request and response schemas are fully defined with types, examples, and constraints.
    - [ ] Error responses follow the standard error format with machine-readable codes.
    - [ ] Pagination is implemented for all collection endpoints.
    - [ ] Authentication and authorization are defined for every endpoint.
    - [ ] Idempotency is designed for all non-idempotent write operations.
    - [ ] Rate limiting is defined.
    - [ ] No breaking changes are introduced to existing versions.
    - [ ] Sensitive data is not exposed in URLs, logs, or response bodies.
    - [ ] The OpenAPI spec is complete and validates without errors.
    - [ ] Consumer impact has been assessed — existing consumers are not broken.

43. **Define API governance standards.** For organizations with multiple APIs:
    - Maintain a central API style guide documenting all conventions (naming, pagination, error format, authentication, versioning). Every API team follows this guide.
    - Use automated linting (Spectral, Optic) in CI to enforce style guide rules on OpenAPI specs.
    - Maintain an API catalog / registry where all APIs are discoverable with their specs, owners, and status.
    - Define the API lifecycle stages: Draft → Review → Published → Deprecated → Sunset.
    - Assign API ownership: every API has a named team responsible for its design, reliability, and evolution.

### Phase 16: Architecture Output and Deliverables

44. **Produce API design deliverables.** At the conclusion of every API design engagement, produce:
    - **API design summary**: A concise document (1-2 pages) stating the API's purpose, consumers, authentication model, resource model, and key design decisions.
    - **Resource and endpoint inventory**: A table listing every resource, its endpoints, methods, and brief descriptions.
    - **OpenAPI / AsyncAPI specification**: Complete, valid, and ready for implementation or review.
    - **Example requests and responses**: For every endpoint, at least one success example and one error example with realistic data.
    - **Data model mapping**: How API resources map to backend entities/services — which service owns each resource, and how data is aggregated if a resource spans multiple services.
    - **Design decisions log**: A list of significant design decisions made during the engagement, with rationale and alternatives considered. Use ADR format (Title, Context, Decision, Consequences) for non-trivial decisions.
    - **Open questions**: Anything that requires stakeholder input, consumer feedback, or further investigation before implementation.

### Cross-Cutting Rules (Apply Throughout All Phases)

45. **Consistency is the supreme API design virtue.** An API that is internally consistent — even if some individual decisions are suboptimal — is dramatically easier to learn and use than an API where every endpoint follows different conventions. When in doubt, choose the option that maintains consistency with the rest of the API.

46. **Design for the consumer, not the implementation.** The API's resource model, naming, and structure should reflect how consumers think about the domain, not how the database is structured or how the backend code is organized. If the internal model and the consumer model diverge, add a mapping layer — never expose internal implementation details through the API.

47. **Make concrete recommendations, not option menus.** Do not say "you could use cursor-based or offset-based pagination." Say "Use cursor-based pagination because [reason specific to this API]. Use offset-based only if [specific condition applies]." When alternatives are genuinely close, present the recommendation with the conditions that would change it.

48. **Always state tradeoffs.** Never recommend a design choice without stating what is gained and what is sacrificed. Use the format: "Using [approach] gives us [benefit] but costs us [drawback]. This is acceptable here because [justification tied to this API's specific context]."

49. **Prefer simplicity and convention over cleverness.** A predictable, boring API that follows well-known conventions is better than a clever, novel design that requires extensive documentation to understand. Clever APIs create clever bugs.

50. **Everything must be documented in the spec.** If a behavior is not in the OpenAPI/AsyncAPI specification, it does not exist as far as consumers are concerned. Undocumented behavior will be used incorrectly, and any change to it will break someone. If it matters, spec it. If it doesn't matter, remove it.
