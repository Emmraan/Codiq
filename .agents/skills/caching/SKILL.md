---
name: caching
description: A unified, end-to-end caching skill that guides the AI agent through the complete lifecycle of caching architecture and engineering — from identifying caching opportunities and selecting caching layers through cache topology design, caching pattern selection, key design, serialization, invalidation strategy, consistency management, cache warming, eviction policies, distributed cache architecture, CDN and edge caching, cache observability, failure handling, capacity planning, performance tuning, and ongoing cache operations. This skill serves as the agent's core decision framework for all caching design, implementation, optimization, and troubleshooting tasks.
---

# Skills

You are a senior caching architect and performance engineer. When this skill is activated, you operate as a disciplined caching specialist who drives every caching conversation toward concrete, justified, and implementable caching designs. You do not recommend caching as a generic performance fix without first understanding the specific access patterns, consistency requirements, and failure modes of the system. You follow a data-driven methodology: identify what is slow or overloaded, measure the current performance, determine whether caching is the correct solution (as opposed to query optimization, schema redesign, or scaling), design the caching layer with explicit invalidation and consistency semantics, implement it, and verify the improvement. Every caching recommendation must be tied to a specific access pattern, measured latency or throughput problem, and consistency tolerance — never to a vague intuition that "caching will make things faster." You treat caching as an architectural decision with significant complexity costs (invalidation, consistency, failure modes, operational overhead) that must be justified by measurable benefits, not as a free performance upgrade.

## When to use

Activate this skill when any of the following signals are present in the conversation:

- The user asks to design a caching strategy for a backend system, service, API, or data layer.
- The user needs to select a caching technology (Redis, Memcached, Valkey, application-level caches, CDN, database query caches, or browser caches).
- The user asks about caching patterns — cache-aside, read-through, write-through, write-behind, refresh-ahead, or request-level memoization.
- The user asks about cache invalidation — TTL-based, event-driven, version-based, or manual purge strategies.
- The user asks about cache consistency — how stale cached data can become, how to prevent serving stale data, or how caching interacts with eventual consistency in distributed systems.
- The user asks about cache key design — key naming conventions, key composition, key cardinality, or key collision avoidance.
- The user reports cache-related performance problems — low hit rates, cache stampedes, hot keys, cache penetration, cache avalanche, memory pressure, or latency spikes from the cache layer.
- The user asks about distributed caching — cache clustering, replication, partitioning, consistent hashing, or multi-region caching.
- The user asks about CDN caching, edge caching, or HTTP caching headers for API responses or static assets.
- The user asks about cache warming, preloading, or cold-start strategies.
- The user asks about eviction policies — LRU, LFU, TTL-based eviction, or memory management for caches.
- The user asks about serialization formats for cached data — JSON, MessagePack, Protocol Buffers, or binary serialization in cache storage.
- The user asks about caching for specific use cases — session caching, query result caching, computed value caching, API response caching, full-page caching, object caching, or rate limiting with cache.
- The user asks about Redis or Memcached architecture, configuration, clustering, persistence, data structures, or operational management.
- The user asks about cache observability — hit rate monitoring, latency tracking, memory utilization, eviction monitoring, or cache-specific dashboards.
- The user asks about cache failure handling — what happens when the cache is down, cache degradation strategies, or circuit breakers for cache layers.
- The user needs to evaluate whether caching is the right solution for a performance problem, or whether the problem should be solved at the database, application, or infrastructure level.
- The user asks about multi-level caching — L1 (in-process) + L2 (distributed) cache hierarchies and coordination between layers.
- The user asks a narrow caching question (e.g., "what should the TTL be?", "should I use Redis or Memcached?", "how do I invalidate this cache?") that requires caching architecture context to answer correctly.

Do NOT activate this skill for general database performance optimization (use the database-performance skill), HTTP API design (use the api-design skill), or CDN configuration for static asset serving with no dynamic caching component.

## Instructions

### Phase 1: Caching Requirements Discovery and Justification

1. **Identify the performance problem that caching is intended to solve.** Caching is not a default architectural component — it is a solution to a specific measured problem. Before any caching design, establish:
   - **What is slow or overloaded?** Specific endpoint, query, computation, or service. State the current measured latency (p50, p95, p99) or throughput.
   - **What is the target?** Acceptable latency or throughput. If the user has no target, help define one based on the use case: "For a product listing API called on every page load, a reasonable target is < 50ms p95."
   - **Why is it slow?** Root cause: expensive database query, high computation cost, slow upstream service call, repeated identical work across requests, or throughput exceeding the backend's capacity.
   - **Is caching the right solution?** Before recommending a cache, verify that simpler solutions have been considered:
     - Can the database query be optimized with a better index? (Cheaper and simpler than caching.)
     - Can the computation be simplified or precomputed in the data pipeline?
     - Can the upstream service be made faster or called less frequently by the application logic?
     - Is the bottleneck actually CPU, memory, or network, not I/O?
       If the root cause can be eliminated at the source, that is preferable to adding a caching layer. Caching masks underlying performance problems — it does not fix them.

   State the justification explicitly: "The product catalog query joins 4 tables and takes 180ms p95. Adding a composite index reduced it to 80ms, but the target is < 20ms for this high-frequency endpoint (called 5,000 times/second at peak). The data changes infrequently (catalog updates happen 3-4 times/day). Caching the query result with a 5-minute TTL will reduce p95 to < 5ms and eliminate 99%+ of database load for this endpoint. The 5-minute staleness is acceptable because catalog updates are not time-critical."

2. **Catalog the data to be cached.** For each candidate cache entry, document:
   - **Data source**: Where does the data come from? (Database query, API call, computation, aggregation.)
   - **Access pattern**: How is this data accessed? By which key(s)? How frequently? (Reads per second.)
   - **Data size**: How large is a single cached value? How many distinct values exist? (Total cache memory = count × size.)
   - **Update frequency**: How often does the source data change? Per second, per minute, per hour, per day?
   - **Consistency tolerance**: How stale can the cached data be before it causes user-visible problems or business impact? Seconds, minutes, hours? What happens if stale data is served? (Product shows old price for 30 seconds = acceptable. User sees another user's data = critical bug. Inventory shows item available when it is sold out = causes failed orders.)
   - **Cardinality**: How many unique cache keys will exist? (10 cached objects vs. 10 million cached objects require very different strategies.)
   - **Access distribution**: Is access uniform across keys, or do some keys receive disproportionate traffic (hot keys)? What percentage of requests hit the top 1% of keys?
   - **Lifetime and relevance**: Does the data have a natural expiry? (Session data expires when the session ends. Price quotes expire after a business period. Historical data never changes.)

3. **Identify what must NOT be cached.** Not all data is cache-eligible. Explicitly exclude:
   - **Security-sensitive decisions**: Authorization checks, permission evaluations (unless the cache is invalidated immediately on permission change and the staleness window is provably zero or the consequence is negligible — most systems cannot guarantee this).
   - **Financial balances and real-time inventory**: Data where serving a stale value causes incorrect business outcomes (double-spending, overselling). Exception: if the system tolerates approximate counts with reconciliation.
   - **User-specific highly mutable data**: Data that changes on nearly every request (real-time counters in a game, live typing indicators). Caching data that changes faster than the cache can be invalidated creates negative value.
   - **Data that is as cheap to compute as to cache**: If the database query is already < 1ms and the result is small, caching it adds complexity without meaningful benefit.
   - **Personally identifiable information without controls**: Caching PII in shared caches without proper access scoping, TTL, and encryption creates compliance risk (GDPR right to erasure must include cached copies).

   State the exclusion list and the rationale for each exclusion.

### Phase 2: Cache Layer Selection

4. **Select the cache layer(s).** Different caching layers solve different problems. Select based on the specific requirements from Phase 1:

   **Layer 1: In-process (application-level) cache**
   - **What it is**: A data structure (hash map, LRU cache) within the application process's memory. No network hop.
   - **When to use**: Small reference data that changes infrequently and is accessed on nearly every request (feature flags, configuration, country/currency lookup tables, compiled templates, schema metadata). Data where < 1µs access time matters. Per-request memoization of repeated computations within a single request lifecycle.
   - **Advantages**: Fastest possible access (no network, no serialization). No external dependency.
   - **Disadvantages**: Not shared across application instances — each instance has its own copy. Inconsistency between instances during updates (instance A has the new value, instance B still has the old value until its TTL expires or it is restarted). Consumes application heap memory — can cause garbage collection pressure or OOM if sized incorrectly. Data is lost on process restart.
   - **Size constraint**: Keep the in-process cache small (tens of MB, not GB). If you need to cache more, use a distributed cache.
   - **Implementation**: Language-native caches (Go: `sync.Map` or `groupcache`; Java: Caffeine, Guava Cache; Python: `functools.lru_cache`, `cachetools`; Node.js: `node-cache`, `lru-cache`).
   - **Invalidation**: TTL-based (simplest — each entry expires after a fixed duration), or event-based (subscribe to a pub/sub channel for invalidation signals). For multi-instance consistency, broadcast invalidation events via Redis pub/sub, Kafka, or a similar mechanism.

   **Layer 2: Distributed cache (shared across application instances)**
   - **What it is**: A separate caching service (Redis, Memcached, Valkey) accessible by all application instances over the network.
   - **When to use**: Data that must be consistent across all application instances, data that is too large for in-process caches, data that must survive application restarts, session data, rate limiting counters, cached query results, cached API responses, cached computations.
   - **Advantages**: Shared state across all instances. Survives application restarts (if the cache service is persistent). Can scale independently of the application.
   - **Disadvantages**: Network round-trip per access (typically 0.5-2ms within the same availability zone). Requires serialization/deserialization. Adds an operational dependency. Cache service itself can fail.

   **Redis** (recommended as the default distributed cache):
   - Rich data structure support: strings, hashes, lists, sets, sorted sets, streams, bitmaps, HyperLogLog. These enable use cases beyond simple key-value caching (leaderboards with sorted sets, rate limiting with sorted sets or token bucket scripts, pub/sub for cache invalidation broadcasts, distributed locks with SETNX).
   - Lua scripting for atomic multi-step operations.
   - Persistence options: RDB (snapshots) and AOF (append-only file) for durability. Can function as a primary data store for ephemeral or reconstructable data.
   - Clustering: Redis Cluster for horizontal scaling and high availability. Redis Sentinel for HA without sharding.
   - Pub/sub for cache invalidation signaling.
   - When to choose: Most caching scenarios. When you need data structures beyond simple key-value. When you need persistence. When you need pub/sub. When you need Lua scripting for atomic operations.

   **Memcached** (specific use cases only):
   - Pure key-value store. Multi-threaded (uses all CPU cores per instance, unlike single-threaded Redis per shard).
   - No persistence, no data structures, no scripting, no pub/sub, no clustering (client-side sharding via consistent hashing).
   - When to choose: Simple key-value caching with very large datasets where Redis's memory overhead per key (due to data structure metadata) is a concern. When you need multi-threaded performance on a single large instance. When you are already operating Memcached and the requirements are met.
   - When NOT to choose: When you need any functionality beyond get/set/delete. When you need persistence. When you need server-side sharding. Default to Redis in new designs.

   **Valkey** (Redis fork, open-source):
   - API-compatible with Redis. Choose Valkey if open-source licensing is important (Redis changed to a non-open-source license in 2024). Feature-equivalent for most caching use cases.

   **Managed services**: AWS ElastiCache (Redis/Memcached), Amazon MemoryDB (durable Redis-compatible), GCP Memorystore, Azure Cache for Redis. Recommend managed services unless there is a specific reason to self-manage (cost at extreme scale, compliance, customization).

   **Layer 3: CDN / Edge cache**
   - **What it is**: A globally distributed cache at the network edge, close to end users. Cloudflare, AWS CloudFront, Fastly, GCP Cloud CDN, Akamai.
   - **When to use**: Static assets (images, CSS, JS, fonts), publicly cacheable API responses (product catalog for unauthenticated users, public content), any response where reducing latency to the end user by serving from a nearby edge node is valuable.
   - **Advantages**: Dramatically reduces latency for geographically distributed users. Offloads traffic from origin servers. Built-in DDoS absorption.
   - **Disadvantages**: Limited invalidation capabilities (purging is eventual, not instant). Difficult to cache personalized or authenticated responses (requires cache key segmentation by auth state or Vary headers). Cache behavior is controlled by HTTP headers — the application must set correct caching headers.
   - **When NOT to use**: For user-specific data, real-time data, or data that must be consistent within seconds of changes (unless using edge computing with origin pulls and short TTLs).

   **Layer 4: Database-level cache**
   - **Query result cache** (MySQL query cache — deprecated and removed in MySQL 8.0; PostgreSQL has no built-in query cache): Generally not recommended as a caching strategy. Database-level caching is better addressed by proper buffer pool sizing (shared_buffers in PostgreSQL) and OS file system cache.
   - **Materialized views**: Precomputed query results stored in the database. Useful for expensive aggregations. Not a "cache" in the traditional sense but serves a similar purpose. Refresh must be triggered explicitly (`REFRESH MATERIALIZED VIEW CONCURRENTLY`).
   - **PostgreSQL shared_buffers / InnoDB buffer pool**: The database's internal page cache. This is not a caching "decision" — it is a configuration tuning task (covered by the database-performance skill). Ensure it is properly sized before adding external caching layers.

   **Layer 5: HTTP response cache (client-side / browser)**
   - **What it is**: Cache controlled by HTTP headers (`Cache-Control`, `ETag`, `Last-Modified`). Stored in the browser or HTTP client.
   - **When to use**: API responses that are safe to cache on the client (public data, user-specific data with appropriate `private` directive). Reduces server load and network round-trips entirely — the client never sends the request.
   - **Design**: Covered in detail in step 24 (HTTP Caching).

   **Multi-level caching (L1 + L2)**:
   When combining layers (e.g., in-process L1 + distributed L2), define the interaction:
   - Request checks L1 (in-process) → hit → return. Miss → check L2 (distributed) → hit → populate L1, return. Miss → fetch from source → populate L2, populate L1, return.
   - L1 TTL must be shorter than L2 TTL to limit cross-instance inconsistency. Example: L1 TTL = 30 seconds, L2 TTL = 5 minutes.
   - Invalidation must propagate to both layers. If an event invalidates L2, it must also invalidate L1 on all instances (via pub/sub broadcast).
   - Multi-level caching adds complexity. Use only when the latency difference between L1 and L2 justifies the additional invalidation complexity and memory cost.

5. **Justify the selection.** For each caching layer chosen, state:
   - Which data / access patterns from the catalog (step 2) this layer caches.
   - Why this layer is appropriate (access latency, data size, sharing requirements, consistency needs).
   - What the layer costs (operational complexity, memory cost, invalidation complexity, failure mode).
   - What alternative was considered and why it was rejected.

### Phase 3: Caching Pattern Selection

6. **Select the caching pattern for each cached data type.** The caching pattern defines how data flows between the application, cache, and data source. Choosing the wrong pattern causes stale data, cache misses, or data loss.

   **Cache-Aside (Lazy Loading)** — recommended as the default pattern:
   - **Flow**:
     1. Application receives a read request.
     2. Application checks the cache for the requested key.
     3. **Cache hit**: Return the cached value directly.
     4. **Cache miss**: Application queries the data source (database, upstream service).
     5. Application writes the result to the cache with a TTL.
     6. Application returns the result to the caller.
   - **Write path**: Application writes to the data source. Optionally invalidates or updates the cache entry.
   - **Advantages**: Simple to implement. The application controls all cache interactions. Cache only contains data that has been requested (no wasted memory on unaccessed data). Cache failure does not prevent the application from functioning — it degrades to hitting the data source directly.
   - **Disadvantages**: Cache miss penalty — the first request for any key pays the full latency of the data source. Potential for stale data if the data source is updated without cache invalidation. Risk of cache stampede (see step 15).
   - **When to use**: Most read-heavy workloads. When you want full control over caching logic. When the data source is the system of record and the cache is purely an optimization.

   **Read-Through**:
   - **Flow**: The application interacts only with the cache. On a cache miss, the cache itself loads the data from the data source, stores it, and returns it.
   - **Advantages**: Application code is simpler — it only reads from the cache, never from the data source directly. Cache loading logic is centralized in the cache layer.
   - **Disadvantages**: Requires the cache layer to know how to load data from the source (more complex cache configuration or a cache-as-a-service with loader support). Same cache miss penalty as cache-aside.
   - **When to use**: When using a cache library or framework that supports loaders (Caffeine with `LoadingCache` in Java, Guava `CacheLoader`). When you want to centralize data loading logic.

   **Write-Through**:
   - **Flow**: When the application writes data, it writes to the cache and the cache synchronously writes to the data source. The cache always has the latest data.
   - **Advantages**: Cache is always consistent with the data source (no stale reads after writes). No separate invalidation needed.
   - **Disadvantages**: Every write incurs the latency of both cache and data source writes (write latency increases). Writes must go through the cache layer, coupling the write path to the cache. If the cache is down, writes fail (unless you implement a fallback to write directly to the data source, which can cause cache inconsistency).
   - **When to use**: When read-after-write consistency is critical and the write volume is low. When the cache is a controlled abstraction layer in front of the data source.

   **Write-Behind (Write-Back)**:
   - **Flow**: The application writes to the cache. The cache asynchronously writes to the data source after a delay or when a batch threshold is reached.
   - **Advantages**: Very fast writes (only cache latency). Batches writes to the data source, reducing load. Absorbs write spikes.
   - **Disadvantages**: **Risk of data loss** — if the cache crashes before the asynchronous write completes, data is lost. Data source is temporarily behind the cache (eventual consistency). Complex to implement correctly with error handling and retry logic.
   - **When to use**: Only when write performance is critical AND the data can tolerate potential loss (analytics events, non-critical counters, session data that can be reconstructed). Never for financial data, user-generated content, or any data where loss causes business impact.
   - **Always state the data loss risk explicitly when recommending write-behind.**

   **Refresh-Ahead (Predictive Refresh)**:
   - **Flow**: The cache proactively refreshes entries before they expire, based on the entry's remaining TTL and recent access frequency. When a cache entry is accessed and its remaining TTL is below a threshold (e.g., < 20% of the original TTL), the cache triggers an asynchronous background refresh.
   - **Advantages**: Eliminates cache miss latency for frequently accessed keys — the cache always has a fresh value ready. Reduces cache stampede risk.
   - **Disadvantages**: Requires background refresh infrastructure. Refreshes data that may not be requested again (wasted work). More complex to implement.
   - **When to use**: For high-traffic, latency-sensitive data where even occasional cache miss latency is unacceptable. For data with predictable access patterns.

   For each data type in the cache catalog (step 2), state which pattern is used and why.

7. **Design the write-path cache interaction.** When source data is modified, how does the cache handle it? This decision directly controls consistency:

   **Option A: Invalidate on write (delete the cache entry)** — recommended as default:
   - When data is written to the source, delete the corresponding cache entry.
   - The next read will be a cache miss, triggering a fresh load from the source.
   - Advantages: Simple. Guarantees the next read gets fresh data. Avoids race conditions between concurrent writes and cache updates.
   - Disadvantages: The next reader pays the cache miss penalty.
   - Preferred when: writes are infrequent relative to reads, cache miss latency is acceptable, and simplicity is valued.

   **Option B: Update on write (write new value to cache)**:
   - When data is written to the source, also write the new value to the cache.
   - Advantages: No cache miss after write — subsequent reads get the fresh value immediately.
   - Disadvantages: Race condition risk — if two concurrent writes occur, the cache may end up with the value from the first write while the database has the value from the second write (write 1 updates DB, write 2 updates DB, write 2 updates cache, write 1 updates cache — cache now has stale value from write 1). Mitigate with: conditional cache updates using version numbers, or by accepting that TTL will eventually correct it.
   - Preferred when: read-after-write consistency is important and writes are serialized or the race condition window is acceptable.

   **Option C: Invalidate on write + read-through repopulation**:
   - Invalidate on write, but the next reader triggers a read-through that repopulates the cache.
   - Combines the simplicity of invalidation with the automation of read-through.

   **Important order of operations**: When using cache-aside with invalidate-on-write:
   - **Write the database first, then invalidate the cache.** Never invalidate the cache first — if the database write fails after cache invalidation, the next read will repopulate the cache with the old value (before the write), and the system is consistent. If you invalidate first and the DB write succeeds, the next read correctly loads the new value.
   - However, if you write the DB first and the cache invalidation fails, the cache serves stale data until TTL expiry. Mitigate with: retry the invalidation, or accept the TTL as the staleness bound.
   - **Never update the cache and the database in a non-atomic operation without a defined consistency strategy.** This is the fundamental challenge of caching. State the strategy explicitly.

### Phase 4: Cache Key Design

8. **Design cache key structure.** Cache key design directly affects hit rate, debuggability, and operational management. Poor key design causes: missed cache hits (same data, different key), key collisions (different data, same key), and difficulty in bulk invalidation.

   **Key naming conventions**:
   - Use a hierarchical, human-readable, delimited format: `{service}:{entity}:{identifier}:{variant}`
   - Examples:
     - `catalog:product:prod_abc123` — single product
     - `catalog:product:prod_abc123:details` — product details view
     - `catalog:product:prod_abc123:pricing:usd` — product pricing in USD
     - `orders:customer:cust_xyz:recent:page1` — recent orders for a customer, page 1
     - `search:products:q=shoes:sort=price:page=1` — search results
   - Use `:` as the delimiter (Redis convention, supports namespace scanning with `SCAN MATCH catalog:product:*`).
   - Keep keys as short as practical — each key consumes memory. For Redis, long keys have measurable overhead at high cardinality. But do not sacrifice readability for brevity — debuggability matters.

9. **Include all cache-varying dimensions in the key.** The cache key must uniquely identify the exact data being cached. If two requests should return different data, they must have different cache keys:

   - **Entity identity**: The primary identifier (product ID, user ID, order ID).
   - **Locale / language**: If responses vary by locale, include it: `catalog:product:prod_abc:en-US`.
   - **Currency**: If pricing varies by currency: `pricing:prod_abc:usd`.
   - **User-specific variants**: If the cached data is personalized, include the user ID: `feed:user:usr_123:page1`. **Warning**: Per-user caching has high cardinality and low hit rates — evaluate whether the cache is actually effective.
   - **Pagination**: Include page/cursor/offset in the key.
   - **Query parameters**: For search/filter results, include all relevant query parameters in a deterministic order. Normalize parameters: `sort=price&q=shoes` and `q=shoes&sort=price` must produce the same key. Sort query parameters alphabetically before building the key.
   - **API version**: If cached API responses differ by version: `v2:catalog:product:prod_abc`.
   - **Schema/data version**: Include a version prefix that changes when the cached data structure changes (e.g., after a deployment that adds a field to the cached object): `v3:catalog:product:prod_abc`. This prevents deserialization errors when old-format cached data is read by new code.

10. **Design key generation for computed/query results.** For cached database query results or computed values where the "identity" is a set of parameters:
    - Hash the normalized, deterministic query parameters: `search:products:sha256(canonical_query_string)`.
    - Include enough of the parameters in plaintext for debuggability: `search:products:q=shoes:sort=price:hash=a1b2c3`.
    - For SQL query result caching, hash the full parameterized query + parameter values. Never include raw SQL in the cache key (it is too long and may contain sensitive data).

11. **Design cache key cardinality management.** High-cardinality caches (millions of unique keys) require explicit management:
    - Estimate the total number of unique cache keys: `unique_entity_count × variants_per_entity`.
    - Estimate total memory: `key_count × (average_key_size + average_value_size + Redis_overhead_per_key)`. Redis overhead is approximately 50-100 bytes per key for metadata.
    - If cardinality is too high for available memory, prioritize: cache only the most frequently accessed keys (LRU eviction handles this naturally), reduce the number of variants, or increase the cache size.
    - Monitor cardinality in production: track key count and memory usage trends.

### Phase 5: Cache Invalidation Design

12. **Design the invalidation strategy.** Cache invalidation is the hardest problem in caching. An invalidation strategy that is too aggressive wastes cache capacity (low hit rate). An invalidation strategy that is too lax serves stale data (consistency violations). Design the strategy explicitly for each cached data type.

    **Strategy 1: TTL-based expiration (time-to-live)** — the foundation of all cache invalidation:
    - Every cache entry must have a TTL. No entry should live indefinitely. Even if another invalidation mechanism is used (event-based), TTL is the safety net that prevents permanently stale data.
    - **Setting TTL values**:
      - The TTL should be based on the data's update frequency and the acceptable staleness:
        - Data changes every few seconds (real-time metrics): TTL = 5-15 seconds, or do not cache.
        - Data changes every few minutes (order status): TTL = 30-60 seconds.
        - Data changes a few times per day (product catalog): TTL = 5-15 minutes.
        - Data changes rarely (country codes, feature flags, configuration): TTL = 1-24 hours.
        - Data never changes (historical records, immutable events): TTL = 24 hours or longer (still set a TTL for memory management).
      - TTL is a contract with the consumer: "This data may be up to [TTL] seconds stale." Make this contract explicit and ensure stakeholders accept it.
    - **TTL jitter**: When many cache entries are created at the same time (application startup, cache warming), they all expire at the same time, causing a "thundering herd" of cache misses. Add random jitter to TTLs: `actual_ttl = base_ttl + random(0, base_ttl * 0.1)`. This spreads expiration across a time window.

    **Strategy 2: Event-driven invalidation** — for consistency-sensitive data:
    - When the source data changes, an event is published (via application event, database CDC, message queue) that triggers cache invalidation.
    - **Implementation patterns**:
      - Application publishes an invalidation event after writing to the database: `publish("cache:invalidate", {"entity": "product", "id": "prod_abc"})`. A cache invalidation subscriber receives the event and deletes or updates the cache entry.
      - Database CDC (Change Data Capture) via Debezium captures row-level changes and publishes events. A consumer invalidates cache entries based on the changed rows. This is more reliable than application-level events because it captures all changes, including those from migration scripts, admin tools, and direct database access.
      - Redis pub/sub for lightweight invalidation signaling between application instances (including L1 in-process cache invalidation).
    - **Advantages**: Minimizes staleness window (data is invalidated within seconds of a change, rather than waiting for TTL expiry). More precise than TTL alone.
    - **Disadvantages**: More complex infrastructure. Event delivery is not guaranteed without careful design (at-least-once delivery, idempotent invalidation). Adds a dependency on the messaging system. Does not eliminate the need for TTL (events can fail — TTL is the safety net).
    - **Always combine event-driven invalidation with TTL.** Events reduce staleness to seconds; TTL provides a guaranteed upper bound on staleness if events fail.

    **Strategy 3: Version-based invalidation** — for coordinated cache updates:
    - Instead of invalidating individual keys, increment a version counter that is part of the cache key: `v5:catalog:product:prod_abc`. When the catalog is updated, increment the version to `v6`. All new reads use `v6` keys, and old `v5` entries naturally expire via TTL.
    - **Advantages**: Atomic invalidation of all related cache entries by changing one version number. No need to enumerate and delete individual keys. Simple to implement.
    - **Disadvantages**: All cached data is abandoned on version change (even data that did not change), causing a temporary spike in cache misses. Requires a mechanism to store and distribute the current version (another cached/shared value, configuration service, or embedded in the application deployment).
    - **When to use**: For bulk updates (full catalog refresh, configuration changes, deployment-triggered data structure changes). Not suitable for fine-grained per-entity invalidation.

    **Strategy 4: Tag-based invalidation** — for group invalidation:
    - Tag cache entries with one or more labels. When a tag is invalidated, all entries with that tag are invalidated.
    - Example: Cache product `prod_abc` with tags `["category:shoes", "brand:nike"]`. When the shoes category is updated, invalidate all entries tagged `category:shoes`.
    - **Implementation**: Not natively supported by Redis or Memcached. Implement with: a reverse index (set of keys per tag in Redis: `SADD tag:category:shoes prod_abc prod_def`), or use a cache library that supports tagging (Symfony Cache, Laravel Cache tags).
    - **When to use**: When invalidation must happen at a group level (all products in a category, all data for a tenant, all cached responses for a specific upstream service).

13. **Design invalidation for common scenarios:**

    **Single entity update**: Product price changes.
    - Invalidate: `catalog:product:prod_abc` and all variants (`catalog:product:prod_abc:pricing:*`).
    - Approach: Event-driven invalidation triggered by the write operation. Use a pattern-based delete (`DEL` specific keys or `UNLINK` for non-blocking delete) if the variant set is known. Avoid `KEYS` command in production (blocks Redis) — use `SCAN` with a pattern if enumeration is needed.

    **Bulk update**: Entire product catalog is refreshed.
    - Approach: Version-based invalidation (increment catalog version). Or event-driven invalidation for each changed entity (if the changeset is bounded). Or cache warming with new data before switching the version.

    **Cascading invalidation**: A category is renamed, which affects all products in that category.
    - Approach: Identify all affected cache entries via tag-based invalidation (`tag:category:shoes`). Or accept that products will serve stale category names until TTL expiry (if the staleness is acceptable).

    **Deployment-triggered invalidation**: New code changes the cached data structure (adds/removes fields).
    - Approach: Include a schema version in the cache key prefix. Deploy new code that writes cache keys with the new version. Old-version entries expire naturally via TTL. No explicit invalidation needed.

    **User-triggered invalidation**: User updates their profile — they should see the update immediately.
    - Approach: Invalidate the user's cache entry on write. For the requesting user, bypass the cache for the next read (read-your-own-write pattern): set a short-lived flag in the user's session indicating a recent write, and skip the cache for that user for the next N seconds.

### Phase 6: Cache Consistency Management

14. **Design for consistency explicitly.** Every cached data type has a consistency requirement. Document it:

    | Cached Data           | Consistency Model   | Max Staleness | Consequence of Stale Data                     | Invalidation Strategy                                                 |
    | --------------------- | ------------------- | ------------- | --------------------------------------------- | --------------------------------------------------------------------- |
    | Product catalog       | Eventual            | 5 minutes     | User sees old price/description               | TTL 5min + event invalidation                                         |
    | User profile (own)    | Read-your-own-write | 0 seconds     | User doesn't see their own edits              | Invalidate on write + bypass cache for writer                         |
    | User profile (others) | Eventual            | 1 minute      | Slight delay in seeing profile changes        | TTL 1min                                                              |
    | Inventory count       | Strong (or none)    | 0 seconds     | Overselling                                   | Do not cache, or cache with TTL 5s + pessimistic stock check on order |
    | Feature flags         | Eventual            | 30 seconds    | Feature toggle takes 30s to propagate         | TTL 30s + event invalidation                                          |
    | Search results        | Eventual            | 10 minutes    | New/updated products don't appear immediately | TTL 10min                                                             |
    | Dashboard aggregates  | Eventual            | 5 minutes     | Dashboards slightly behind real-time          | TTL 5min, refresh-ahead                                               |

    **Read-your-own-write consistency**: After a user makes a change, that user must see their own change immediately, even if other users see a stale version. Implementation:
    - On write: invalidate or update the cache entry.
    - For the writing user's subsequent reads: either bypass the cache for a short window (set a per-user `last_write_timestamp` and skip cache if `now - last_write_timestamp < threshold`), or read from the primary database rather than a cache/replica.
    - Other users' reads: continue serving from cache with normal TTL.

    **Cross-service cache consistency**: When a cache in Service A depends on data owned by Service B:
    - Service B publishes change events → Service A subscribes and invalidates its cache.
    - If the event system fails, Service A's TTL eventually expires and the cache is refreshed.
    - The staleness window is: min(TTL, event_delivery_latency). Design both to meet the consistency requirement.

### Phase 7: Cache Failure Handling and Resilience

15. **Design cache stampede prevention.** A cache stampede (thundering herd) occurs when a popular cache entry expires and many concurrent requests simultaneously hit the data source to repopulate it. At scale, this can overload the database and cause cascading failures.

    **Prevention mechanisms**:

    **Mechanism 1: Locking (mutex-based repopulation)**:
    - On cache miss, the first request acquires a lock (Redis `SETNX` with TTL) and repopulates the cache. Concurrent requests either wait for the lock to release and then read from cache, or return a stale value if available.
    - Implementation:
      ```
      value = cache.get(key)
      if value is not None:
          return value
      if cache.set(lock_key, "1", nx=True, ex=30):  # Acquire lock
          try:
              value = fetch_from_source()
              cache.set(key, value, ex=ttl)
          finally:
              cache.delete(lock_key)
          return value
      else:
          # Another request is repopulating — wait briefly and retry
          sleep(50ms)
          return cache.get(key) or fetch_from_source()  # Fallback if lock holder fails
      ```
    - Lock TTL must be longer than the expected source fetch time but short enough to unblock waiters if the lock holder crashes.

    **Mechanism 2: Probabilistic early expiration**:
    - Each request that accesses a cache entry has a small probability of refreshing it before the TTL expires. The probability increases as the entry approaches its expiry.
    - Formula: `should_refresh = random() < (time_since_set / ttl) ^ beta` (where beta controls aggressiveness).
    - Advantage: No locks, no coordination. Spreads refresh load naturally.
    - Disadvantage: Non-deterministic. In rare cases, the entry may still expire without being refreshed.

    **Mechanism 3: Background refresh (refresh-ahead)**:
    - A background process or thread refreshes cache entries before they expire. The cache is never empty for popular keys.
    - Implementation: Track access recency. For keys accessed within the last refresh window, proactively refresh when TTL reaches a threshold (e.g., < 20% remaining).
    - Advantage: Cache consumers never experience a miss on popular keys.
    - Disadvantage: Requires background infrastructure. May refresh keys that are no longer being accessed (wasted work).

    **Mechanism 4: Stale-while-revalidate**:
    - Serve the expired (stale) cache entry to the caller while triggering an asynchronous background refresh.
    - The caller gets an immediate response (stale but fast). The next caller gets the fresh value.
    - Implementation: Store both the value and its expiry timestamp. On access, if expired, return the stale value and trigger async refresh. Set a maximum stale duration beyond which even stale data is not served.
    - Advantage: Zero cache-miss latency for the caller. Eliminates stampede.
    - Disadvantage: Callers may see briefly stale data during the refresh window.

    Choose the mechanism based on the use case. For most systems, locking + stale-while-revalidate provides the best balance. State the choice and rationale.

16. **Design cache penetration prevention.** Cache penetration occurs when requests repeatedly ask for data that does not exist in the data source. Every request is a cache miss and hits the database, because there is nothing to cache.

    - **Null object caching**: When the data source returns no result, cache a sentinel "not found" value with a short TTL (30-60 seconds): `cache.set("product:nonexistent_id", NULL_SENTINEL, ex=60)`. On cache hit with the sentinel, return "not found" without hitting the database. This prevents repeated database queries for non-existent keys.
    - **Bloom filter**: For very high-cardinality datasets where many lookups target non-existent keys, use a Bloom filter in front of the cache/database. If the Bloom filter says the key definitely does not exist, skip the database query entirely. If it says "maybe exists," proceed with the normal cache/database lookup. Bloom filters have a small false-positive rate (tunable) and zero false-negative rate. Rebuild periodically as data changes.
    - **Input validation**: Validate that the requested key/ID is in a valid format before querying. Reject obviously invalid keys (wrong format, wrong length) at the API layer.

17. **Design cache avalanche prevention.** A cache avalanche occurs when a large number of cache entries expire simultaneously (e.g., after a mass cache warming at startup, or after a cache server restart), causing a sudden spike in database load.

    - **TTL jitter** (primary prevention): Add random jitter to TTLs so entries expire at different times (see step 12).
    - **Staggered cache warming**: When warming the cache (step 19), load entries gradually rather than all at once.
    - **Circuit breaker on the data source**: If the database or upstream service is overwhelmed by cache miss traffic, use a circuit breaker to reject excess requests rather than cascading the overload. Return errors or degraded responses rather than killing the database.
    - **Multi-layer caching**: If the L2 (distributed) cache fails, the L1 (in-process) cache provides partial coverage while the L2 recovers.

18. **Design cache failure handling.** The cache is an optimization, not a correctness requirement (unless you are using write-behind, which is explicitly a correctness concern). Design the system to function without the cache:

    **Cache-as-optimization principle**: If the cache is unavailable, the system should continue to function correctly, though with degraded performance (higher latency, higher database load).

    **Implementation**:
    - **Wrap all cache operations in try/catch** (or equivalent error handling). A cache timeout or connection error must never cause the request to fail — it should fall through to the data source.
    - **Cache timeouts**: Set aggressive timeouts on cache operations:
      - Connection timeout: 100-500ms.
      - Read/write timeout: 50-200ms.
      - If the cache does not respond within this window, skip it and go to the data source. A slow cache is worse than no cache — it adds latency without providing value.
    - **Circuit breaker on the cache**: If the cache fails repeatedly (e.g., 5 consecutive failures within 10 seconds), open the circuit breaker and stop attempting cache operations for a cooldown period (30-60 seconds). This prevents every request from paying the cache timeout penalty during an outage. After the cooldown, half-open the circuit (try one request) and close the circuit if it succeeds.
    - **Graceful degradation**: When the cache is down:
      - Increase database connection pool size temporarily (if possible) to handle the increased load.
      - Enable application-level rate limiting on cache-dependent endpoints to prevent database overload.
      - Log the cache failure and alert the operations team.
      - Consider serving stale data from a backup source (replicated cache, database query cache) if available.
    - **Cache recovery**: When the cache comes back online after a failure:
      - Allow the cache to warm naturally (cache-aside populates on each miss). Do not attempt to warm the entire cache at once — this can overload the database.
      - Or trigger a controlled cache warming process (step 19) that loads critical data gradually.

    **When the cache IS a correctness dependency** (rate limiting, distributed locks, session storage):
    - These use cases require the cache to be highly available. Design for HA:
      - Redis Sentinel or Redis Cluster with automatic failover.
      - Multi-AZ deployment with synchronous replication for the session/lock data.
      - Fallback mechanism: if Redis is down for rate limiting, fall back to in-memory rate limiting per instance (less accurate but still provides some protection).
      - For sessions: fall back to signed JWT tokens (no server-side state needed) during cache outage, or use database-backed sessions as a degraded fallback.

### Phase 8: Cache Warming and Cold Start

19. **Design cache warming strategy.** A cold cache (empty or after restart) causes every request to hit the data source, creating a load spike ("cold start thundering herd"):

    **Strategy 1: Passive warming (lazy loading)** — accept the cold start:
    - Cache populates naturally as requests arrive. Each cache miss loads from the source and populates the cache.
    - Acceptable when: traffic ramps up gradually (not a sudden spike), the data source can handle the temporary increase in load, and cache miss latency is acceptable for the first few minutes.
    - Risk: If traffic is high immediately (e.g., after a deployment during peak hours), the data source may be overwhelmed.

    **Strategy 2: Active warming (preloading)** — populate the cache before serving traffic:
    - Before an application instance starts accepting requests, preload critical cache entries:
      - Identify the "hot set" — the most frequently accessed keys. Use production access logs or analytics to identify the top N keys by access frequency.
      - Load these keys from the data source and populate the cache.
      - Start accepting traffic only after warming is complete (Kubernetes readiness probe gates traffic until warming finishes).
    - **Warming rate**: Load keys gradually, not all at once. Use a rate limiter on the warming process (e.g., 100 keys/second) to avoid overwhelming the data source. The warming time for N keys at R keys/second is N/R seconds — ensure this fits within the deployment timeline.
    - **Warming on schedule**: For predictable traffic patterns (e.g., business hours start at 9 AM), trigger cache warming at 8:45 AM.
    - **Warming from a replica**: Load data from a database read replica rather than the primary, to avoid impacting write performance during warming.

    **Strategy 3: Cache persistence (Redis-specific)**:
    - Configure Redis RDB snapshots or AOF persistence so that cache data survives Redis restarts. After restart, Redis reloads data from disk — the cache is immediately warm.
    - **RDB**: Periodic snapshots (e.g., every 5 minutes). Fast recovery, but data written since the last snapshot is lost.
    - **AOF**: Every write operation is logged. Complete data recovery but slower restart (must replay the log). Use `AOF rewrite` to compact the log periodically.
    - **Both**: Use RDB for fast restart + AOF for completeness. Recommended for caches where warm restart is important.
    - Tradeoff: Persistence adds I/O overhead and disk space usage. For pure caches (data can be reloaded from the source), persistence is optional. For caches that are also used for sessions, rate limiting, or locks, persistence is important.

    **Strategy 4: Priming from a sibling instance**:
    - When a new application instance starts, it can copy the hot set from an already-warm sibling instance's L1 cache, or from the shared L2 cache. This is applicable in L1/L2 architectures.

    State the warming strategy and estimate the warming time and data source load impact.

### Phase 9: Serialization and Memory Optimization

20. **Design cache value serialization.** The serialization format affects cache performance (serialization/deserialization speed), memory usage (serialized size), and compatibility (schema evolution):

    **JSON** (default recommendation for most cases):
    - Human-readable (aids debugging — you can inspect cached values with `redis-cli GET`).
    - Widely supported across all languages.
    - Disadvantages: Larger than binary formats (field names are repeated in every value), slower to serialize/deserialize than binary formats.
    - When to use: Most applications. When debuggability is valued. When the performance difference between JSON and binary is not measurable in the context of the application's overall latency.

    **MessagePack** (recommended for performance-sensitive caches):
    - Binary format, structurally similar to JSON but more compact (~30-50% smaller). Faster to serialize/deserialize than JSON.
    - Disadvantages: Not human-readable. Requires MessagePack libraries in all consuming languages.
    - When to use: High-throughput caches where serialization overhead or memory usage is measurable. When cache values are large.

    **Protocol Buffers** (recommended for strongly-typed, schema-evolving caches):
    - Strongly typed, schema-defined, very compact, very fast.
    - Supports schema evolution (adding/removing fields without breaking existing cached data).
    - Disadvantages: Requires `.proto` schema definitions and code generation. Not human-readable. More setup overhead.
    - When to use: When cached data has a well-defined, evolving schema shared across multiple services. When cache size and serialization speed are critical.

    **Native language serialization** (Java Serializable, Python pickle, etc.):
    - **Never use for distributed caches.** Security risk (deserialization attacks), not cross-language compatible, fragile across code versions (class changes break deserialization). Acceptable only for in-process L1 caches within the same application where objects are stored directly in memory.

    **Compression** (for large cached values):
    - If cached values are large (> 1KB), apply compression before storing: gzip, LZ4, Snappy, or zstd.
    - LZ4 or Snappy: Fast compression/decompression, moderate compression ratio. Recommended for latency-sensitive caches.
    - gzip or zstd: Higher compression ratio, slower. Recommended when memory savings outweigh the CPU cost.
    - Only compress if the values are large enough for compression to be meaningful. Compressing 100-byte values adds overhead without significant size reduction.
    - Measure compression ratio and CPU impact before committing to compression in production.

21. **Design memory optimization for the cache.** Cache memory is finite and expensive. Optimize usage:

    **Right-size cached values**:
    - Cache only the fields that consumers need, not the entire database row or object. If an endpoint only uses `{id, name, price}`, don't cache `{id, name, price, description, full_spec, images, reviews, ...}`.
    - Use separate cache entries for different access patterns: `product:prod_abc:summary` (lightweight, for listing pages) and `product:prod_abc:full` (complete, for detail pages).

    **Redis-specific memory optimization**:
    - Use the appropriate Redis data structure:
      - **Strings**: For simple key-value pairs. Each string key has ~50 bytes of overhead.
      - **Hashes**: For objects with multiple fields. For small hashes (< `hash-max-ziplist-entries` and `hash-max-ziplist-value` thresholds), Redis uses a memory-efficient ziplist encoding. Store object fields as hash fields: `HSET product:prod_abc name "Shoes" price "49.99"`. More memory-efficient than storing a serialized JSON string for small objects.
      - **Sets and Sorted Sets**: For collections and ranked data. Use when the access pattern requires set operations (membership check, intersection, union, ranked retrieval).
    - Configure `maxmemory` and `maxmemory-policy` (see step 22).
    - Monitor memory usage: `INFO memory`, `MEMORY USAGE key`, `MEMORY DOCTOR`.
    - Identify large keys: `redis-cli --bigkeys` or `MEMORY USAGE` for specific keys. Large keys (> 1MB) cause latency spikes during serialization and network transfer. Break them into smaller keys or compress them.

### Phase 10: Eviction Policy Design

22. **Design the eviction policy.** When the cache reaches its memory limit, it must decide which entries to remove to make room for new ones:

    **Configure `maxmemory`**: Set the maximum memory Redis will use. Leave headroom for Redis overhead (fragmentation, replication buffers): set `maxmemory` to 75-85% of available instance memory.

    **Select the eviction policy** (`maxmemory-policy`):

    - **`allkeys-lru`** (recommended as default): Evict the least recently used key from the entire keyspace. Best general-purpose policy — naturally keeps hot data and evicts cold data. Use when all keys are cache entries and any key can be evicted.
    - **`allkeys-lfu`** (Least Frequently Used): Evict the least frequently used key. Better than LRU when access patterns have stable popularity (some keys are consistently popular, not just recently accessed). Prevents "cache pollution" where a one-time scan of many keys evicts frequently used data.
    - **`volatile-lru`**: Evict the least recently used key only among keys with a TTL set. Keys without TTL are never evicted. Use when mixing cache entries (with TTL) and persistent data (without TTL, e.g., configuration) in the same Redis instance. **Not recommended** — mix cache and persistent data in separate Redis instances/databases.
    - **`volatile-ttl`**: Evict the key with the shortest remaining TTL. Use when you want entries closest to expiration to be evicted first.
    - **`noeviction`**: Do not evict any keys. Return an error on write when memory is full. Use for data stores where data loss is unacceptable (session store, rate limiting state). Requires careful capacity planning.
    - **`allkeys-random`**: Evict a random key. Use only as a baseline for comparison — LRU and LFU are almost always better.

    **Recommendation**: Use `allkeys-lfu` for production caches with stable access patterns. Use `allkeys-lru` if you are unsure of the access distribution or if access patterns are bursty. Use `noeviction` for non-cache use cases (sessions, locks, rate limiting) where eviction would cause incorrect behavior.

    Monitor the eviction rate (`INFO stats` → `evicted_keys`). A sustained high eviction rate indicates the cache is too small for the working set — either increase memory or reduce the cached data volume.

### Phase 11: Distributed Cache Architecture

23. **Design the distributed cache topology.** For production systems, a single Redis instance is a single point of failure and a scalability limitation:

    **Redis Sentinel (high availability without sharding)**:
    - A master-replica setup with Sentinel processes monitoring the master. If the master fails, Sentinel promotes a replica to master automatically.
    - Architecture: 1 master + 1-2 replicas + 3 Sentinel instances (odd number for quorum).
    - **Use when**: The data fits on a single instance (< available memory of the largest practical instance). You need HA but not horizontal scalability.
    - **Failover behavior**: Sentinel detects master failure (configurable timeout, e.g., 5 seconds) → elects a new master → application clients reconnect (clients must use Sentinel-aware connection libraries). Failover typically takes 5-30 seconds. During failover, writes fail; reads may succeed from replicas if the client supports read-from-replica.
    - **Data loss risk**: Asynchronous replication means writes acknowledged by the master may not have been replicated to the replica at failover time. Data written in the last few milliseconds before failure may be lost. For caches, this is acceptable (the data can be reloaded from the source). For sessions or locks, consider `WAIT` command for synchronous replication of critical writes.

    **Redis Cluster (horizontal scaling + HA)**:
    - Data is automatically partitioned across multiple master nodes using hash slots (16,384 slots distributed across masters). Each master has one or more replicas.
    - Architecture: Minimum 3 masters + 3 replicas (6 instances). Each master owns a subset of the 16,384 hash slots.
    - **Use when**: Data volume exceeds single-instance memory. Write throughput exceeds single-instance capacity. You need horizontal scalability.
    - **Key distribution**: Keys are assigned to hash slots based on `CRC16(key) % 16384`. Related keys can be co-located on the same shard using hash tags: `{user:123}:profile` and `{user:123}:settings` both hash to the slot for `user:123`. This is important for multi-key operations (MGET, transactions, Lua scripts), which only work on keys in the same hash slot.
    - **Limitations**: Multi-key operations across different hash slots fail or require application-level handling. Lua scripts can only access keys on the same shard. Pub/sub works but messages are broadcast to all nodes (not filtered by shard). Database selection (`SELECT`) is not supported (only database 0).
    - **Scaling**: Add new masters and rebalance hash slots (data migrates between nodes). This is online but may cause brief latency spikes during migration.

    **Managed services** (recommended unless specific requirements demand self-management):
    - AWS ElastiCache (Redis): Supports Cluster Mode Enabled (Redis Cluster), automatic failover, read replicas, encryption, and backup. Cluster Mode Disabled for Sentinel-equivalent HA.
    - Amazon MemoryDB: Redis-compatible with strong consistency and durability (multi-AZ transaction log). Use when cache data must not be lost (sessions, state).
    - GCP Memorystore: Managed Redis with automatic failover.
    - Azure Cache for Redis: Managed Redis with clustering, geo-replication, and persistence.

    **Multi-region caching**:
    - For globally distributed applications, deploy a cache instance in each region. Options:
      - **Independent caches per region**: Each region has its own cache, populated independently. Simplest, but cache hit rate is lower in each region (each region has its own cold start).
      - **Global replication** (Redis Enterprise Active-Active, MemoryDB multi-region): Data is replicated across regions. Higher hit rate, but replication latency means writes in one region may not be immediately visible in another. Conflict resolution for concurrent writes (last-write-wins or CRDT-based).
      - **Read from local cache, invalidate globally**: Writes invalidate cache entries in all regions via a global event bus (Kafka, SNS/SQS). Each region repopulates from its local data source on the next read.

### Phase 12: HTTP Caching and CDN Design

24. **Design HTTP caching.** HTTP caching is the most efficient caching layer — it prevents requests from reaching your servers entirely. Design it using standard HTTP caching headers:

    **Cache-Control header design** — define per endpoint:
    - **Public, cacheable responses** (product catalog, public content):

      ```
      Cache-Control: public, max-age=300, s-maxage=600, stale-while-revalidate=60
      ```
      - `public`: Response can be cached by browsers, CDNs, and shared proxies.
      - `max-age=300`: Browser caches for 5 minutes.
      - `s-maxage=600`: CDN/shared proxies cache for 10 minutes (overrides `max-age` for shared caches).
      - `stale-while-revalidate=60`: After `max-age` expires, serve the stale response while revalidating in the background for up to 60 seconds. Eliminates latency for the first request after expiration.

    - **Private, user-specific responses** (user profile, order history):

      ```
      Cache-Control: private, max-age=60, no-transform
      ```
      - `private`: Only the end-user's browser can cache this. CDNs and shared proxies must not cache.
      - `max-age=60`: Browser caches for 1 minute.
      - `no-transform`: Proxies must not modify the response (no compression, no format conversion).

    - **Non-cacheable, sensitive responses** (authentication responses, financial data):

      ```
      Cache-Control: no-store
      ```
      - `no-store`: No caching at all — not by the browser, not by the CDN, not by any proxy. The response must be fetched from the server every time.
      - Do not use `no-cache` when you mean `no-store`. `no-cache` means "cache, but revalidate with the server before using" (it still stores the response). `no-store` means "do not store the response at all."

    - **Immutable assets** (versioned static files: `app.a1b2c3.js`):
      ```
      Cache-Control: public, max-age=31536000, immutable
      ```
      - `immutable`: The response body will never change for this URL. Browsers skip revalidation even on page refresh. Use only for content-addressed URLs (URL changes when content changes).

25. **Design conditional requests (ETags and Last-Modified).** For responses that change infrequently, conditional requests save bandwidth and server processing:

    **ETag-based** (recommended):
    - Server generates an ETag (a hash of the response body or a version identifier) and includes it in the response: `ETag: "a1b2c3d4"`.
    - On subsequent requests, the client sends `If-None-Match: "a1b2c3d4"`.
    - If the ETag matches (data has not changed), the server returns `304 Not Modified` with no body — saving bandwidth and serialization cost.
    - If the ETag does not match, the server returns the full response with the new ETag.
    - **Strong vs. weak ETags**: Strong ETags (`"a1b2c3"`) indicate byte-for-byte identical responses. Weak ETags (`W/"a1b2c3"`) indicate semantically equivalent responses (useful when the response format might vary slightly but the content is the same). Use strong ETags unless there is a specific reason for weak.
    - **ETag generation**: Hash the response body (SHA-256 or similar), or use a version counter/timestamp from the data source. Do not use the database row's `updated_at` timestamp as the sole ETag if the response aggregates data from multiple sources — use a composite hash.

    **Last-Modified-based** (simpler, less precise):
    - Server includes `Last-Modified: Wed, 15 Jan 2024 10:30:00 GMT`.
    - Client sends `If-Modified-Since: Wed, 15 Jan 2024 10:30:00 GMT`.
    - Server returns `304 Not Modified` or the full response.
    - Less precise than ETags (1-second granularity) and does not handle multiple representations of the same resource. Use ETags when possible.

26. **Design CDN caching strategy.** For public-facing APIs and content:

    **What to cache at the CDN**:
    - Static assets: Always. Long TTL + content-addressed URLs.
    - Public API responses: Product listings, content pages, public search results. Short to medium TTL (30s - 10min) based on update frequency.
    - Semi-personalized responses: Responses that vary by a small number of dimensions (locale, device type) can be cached at the CDN using `Vary` headers or cache key customization.

    **What NOT to cache at the CDN**:
    - Authenticated/user-specific API responses: Unless the CDN supports edge computing (Cloudflare Workers, Lambda@Edge, Fastly Compute) that can validate tokens and route to user-specific cache keys.
    - Write requests (POST, PUT, DELETE): CDNs should pass these through to the origin.
    - Real-time data: Stock prices, live sports scores, chat messages.

    **CDN cache key design**:
    - Default CDN cache key: URL + query parameters + `Vary` headers.
    - Customize the cache key at the CDN when needed:
      - Include specific headers (e.g., `Accept-Language`) to cache locale-specific responses.
      - Exclude irrelevant query parameters (tracking parameters like `utm_source`) from the cache key to increase hit rate.
      - Include the `Authorization` header presence (not the value) to separate authenticated vs. unauthenticated responses.
    - **`Vary` header**: Tells the CDN/browser which request headers cause response variation: `Vary: Accept-Language, Accept-Encoding`. Do not use `Vary: *` — it disables caching. Do not use `Vary: Cookie` — it creates a unique cache entry per user (effectively disabling caching for CDN). Use `Vary` sparingly and with known, bounded dimensions.

    **CDN cache invalidation**:
    - **API-based purge**: Purge specific URLs or patterns via the CDN provider's API when content changes: `purge("/api/v1/products/prod_abc")`.
    - **Surrogate keys (cache tags)**: Some CDNs (Fastly, Cloudflare) support tagging responses with surrogate keys. Purge by tag: `purge(tag: "product:prod_abc")` — invalidates all responses tagged with that key, regardless of URL.
    - **Soft purge / stale-while-revalidate**: Instead of hard purge (immediate removal), mark the entry as stale and let the CDN revalidate on the next request. Prevents stampede at the CDN edge.
    - **Purge propagation time**: CDN purges are not instant — propagation across all edge nodes takes seconds to minutes. Design for this delay. If instant invalidation is required, use short `s-maxage` values rather than relying on purges.

### Phase 13: Caching for Specific Use Cases

27. **Design API response caching.** For caching entire API endpoint responses:
    - **Cache the serialized response** (JSON/MessagePack) rather than the deserialized object. This avoids re-serialization on cache hit.
    - **Include all response-varying parameters in the cache key** (see step 9): URL path, query parameters (normalized), and relevant headers (locale, API version).
    - **Cache at the right layer**:
      - CDN/edge cache for public responses (highest performance, lowest origin load).
      - API gateway cache for authenticated but reusable responses (e.g., all users in the same organization see the same dashboard).
      - Application-level cache for complex, computed responses that require application logic to determine cacheability.
    - **Respect the HTTP caching contract**: Set `Cache-Control`, `ETag`, and `Vary` headers correctly (steps 24-26) so that intermediaries (CDNs, proxies, browsers) can cache effectively.

28. **Design query result caching.** For caching database query results:
    - **Cache the query result**, not individual rows. A query result is a specific projection (selected columns, ordering, filtering) of the data.
    - **Cache key**: Derive from the query and its parameters. For parameterized queries: `query_cache:{query_hash}:{param_hash}`. For known, named queries: `orders:customer:cust_123:status:active:page:1`.
    - **Invalidation**: Invalidate when any data that contributes to the result changes. For simple single-entity queries, invalidate by entity ID. For complex queries (joins, aggregations), invalidation is harder:
      - Use event-driven invalidation: when any contributing entity changes, invalidate all cached queries that might include it. This may over-invalidate (invalidating queries that are not actually affected), but it prevents serving stale results.
      - Use coarse-grained invalidation: invalidate all cached queries for a table when any row in that table changes. Simple but wasteful — acceptable when write frequency is low.
      - Accept TTL-based consistency: for complex queries, accept that the cache may be stale for up to the TTL duration. This is often the most practical approach for reporting/analytics queries.

29. **Design session caching.** For storing user sessions in a cache:
    - Use Redis with persistence (AOF or RDB) to survive restarts without losing sessions.
    - Session key: `session:{session_id}`. Session ID is a CSPRNG-generated opaque token (see authentication skill).
    - Session value: Serialized session data (user ID, roles, session metadata). Keep session data small (< 1KB). Store large data (shopping cart contents, form drafts) separately with references in the session.
    - TTL: Set to the session absolute timeout (e.g., 24 hours). Update TTL on each access to implement idle timeout (`EXPIRE` command).
    - **Eviction policy**: Use `noeviction` for the Redis instance storing sessions. Evicting an active session logs the user out unexpectedly. Size the Redis instance to hold all active sessions with headroom.
    - **Security**: Do not store sensitive data in the session (passwords, full credit card numbers). If sessions must be encrypted at rest, encrypt the session value before storing in Redis.

30. **Design rate limiting with cache.** Redis is commonly used as the backing store for rate limiting:
    - **Fixed window**: Increment a counter keyed by `ratelimit:{client_id}:{window}` (e.g., `ratelimit:api_key_123:202401151030`). Set TTL to the window duration. Check counter against limit.
    - **Sliding window log**: Store timestamps of each request in a sorted set. Count entries within the window using `ZRANGEBYSCORE`. Remove entries outside the window using `ZREMRANGEBYSCORE`. More accurate than fixed window but uses more memory.
    - **Token bucket** (recommended for most rate limiting): Implement via Lua script for atomicity:
      - Check the bucket: how many tokens are available?
      - Calculate tokens added since last check based on elapsed time and refill rate.
      - If tokens are available, decrement and allow. If not, reject.
      - Advantages: Allows short bursts while maintaining a long-term average rate.
    - **Sliding window counter** (good balance of accuracy and efficiency): Combine the current window's counter with the previous window's counter, weighted by the elapsed time in the current window. More accurate than fixed window, less memory than sliding log.
    - Store rate limiting state in Redis with `noeviction` policy. Rate limiting data must not be evicted — an evicted rate limit counter resets the limit, allowing an abuse burst.

31. **Design computed value caching.** For caching the results of expensive computations:
    - **ML model inference results**: Cache predictions keyed by the input feature hash. Useful when the same input is queried repeatedly (product recommendations for popular items, classification of commonly submitted content).
    - **Aggregation results**: Cache the result of expensive aggregation queries (daily sales totals, user activity summaries). Refresh on a schedule or via event-driven computation. Accept staleness equal to the refresh interval.
    - **Rendered content**: Cache rendered templates, generated PDFs, processed images. Key by the input parameters + template version. Invalidate when the template or input data changes.
    - **Configuration compilation**: Cache compiled/resolved configuration (feature flags, A/B test assignments, routing rules). Refresh via event on configuration change.

### Phase 14: Hot Key Management

32. **Identify and mitigate hot keys.** A hot key is a cache key that receives disproportionately high traffic. In a distributed cache, the shard holding the hot key becomes a bottleneck while other shards are idle:

    **Identifying hot keys**:
    - Redis: `redis-cli --hotkeys` (requires `maxmemory-policy` to include LFU), `OBJECT FREQ key`, or monitor `SLOWLOG` for frequently accessed keys.
    - Application-level: Log cache key access counts per interval. Alert when a single key exceeds a threshold (e.g., > 1% of total traffic).
    - Common hot keys: Global configuration, popular product pages, viral content, trending topics, authentication tokens for system-wide service accounts.

    **Mitigation strategies**:

    **Strategy 1: Local (L1) caching of hot keys**:
    - Cache the hot key's value in-process (L1 cache) with a very short TTL (1-5 seconds). Most requests are served from L1 without hitting the distributed cache.
    - The distributed cache (L2) remains the source, but traffic to it is reduced by 95%+.

    **Strategy 2: Key replication / read replicas**:
    - Create multiple copies of the hot key with a suffix: `product:hot_item:{shard_1}`, `product:hot_item:{shard_2}`, ... up to N replicas. Distribute reads randomly across replicas.
    - Write updates to all replicas (fan-out on write).
    - Reduces load on any single shard by N×.
    - Complexity: Maintaining N replicas and ensuring consistency on writes.

    **Strategy 3: Application-level sharding of the value**:
    - If the hot key is a large value (e.g., a leaderboard or a large set), split it into multiple keys by range or hash. Aggregate on read.

    **Strategy 4: Rate limiting at the application level**:
    - If the hot key access is caused by a burst of identical requests (e.g., product page goes viral), collapse identical concurrent requests at the application level: the first request fetches the data, concurrent requests wait for the first one to complete and share the result (request coalescing / singleflight pattern).
    - Go: `golang.org/x/sync/singleflight`. Java: custom implementation with `CompletableFuture`. Node.js: custom implementation with shared `Promise`.

### Phase 15: Cache Observability

33. **Design cache monitoring metrics.** Cache health must be continuously monitored. Without monitoring, you cannot know if the cache is providing value, or if it is a liability:

    **Hit rate metrics** (the primary measure of cache effectiveness):
    - **Hit rate** = `cache_hits / (cache_hits + cache_misses) × 100%`.
    - Target: > 90% for most caches. > 95% is excellent. > 99% for highly optimized, stable-data caches.
    - Below 80%: Investigate — the cache may not be providing significant value. Possible causes: too many unique keys (high cardinality, low repetition), TTL too short, eviction rate too high (cache too small), or the access pattern is not cache-friendly.
    - Track hit rate over time — a declining hit rate indicates a problem (data growth, traffic pattern change, configuration issue).
    - Track hit rate per cache key prefix or data type if possible, not just globally. A global 95% hit rate may mask a 30% hit rate for a specific, critical data type.

    **Latency metrics**:
    - Cache read latency: p50, p95, p99. Typically < 1ms within the same AZ. Alert if p99 exceeds 5ms (indicates network issues, slow operations, or large values).
    - Cache write latency: p50, p95, p99. Typically similar to read latency.
    - Cache miss penalty: Latency of the downstream fetch (database query, API call) that occurs on a cache miss. This is the cost that the cache avoids — tracking it demonstrates the cache's value.
    - End-to-end request latency with cache hit vs. cache miss: Demonstrates the user-facing impact of the cache.

    **Memory and capacity metrics**:
    - Memory used vs. `maxmemory`: `INFO memory` → `used_memory` / `maxmemory`. Alert when utilization exceeds 80%.
    - Memory fragmentation ratio: `mem_fragmentation_ratio`. Ideal: 1.0-1.5. Above 1.5 indicates fragmentation (Redis is using more RSS memory than its data requires). Below 1.0 indicates swapping (critical — Redis performance degrades severely when swapping). Alert on fragmentation ratio > 1.5 or < 1.0.
    - Key count: Total number of keys (`DBSIZE`). Track growth over time.
    - Eviction count: `evicted_keys` from `INFO stats`. A non-zero eviction rate means the cache is full and discarding data. If evictions are high, either increase memory or reduce the cached data volume.

    **Connection metrics**:
    - Connected clients: Track against `maxclients`. Alert at 80% of maximum.
    - Rejected connections: Should be zero. Non-zero indicates `maxclients` is reached.
    - Connection rate: Sudden spikes indicate connection leak or misconfigured pool.

    **Replication metrics** (Redis Sentinel/Cluster):
    - Replication lag: Bytes behind or seconds behind the master. Alert if lag exceeds 1MB or 1 second.
    - Connected replicas: Alert if a replica disconnects.
    - Failover events: Log and alert on every failover.

    **Command metrics**:
    - Commands processed per second: `instantaneous_ops_per_sec`. Track trends to understand traffic growth.
    - Slow log: `SLOWLOG GET`. Track commands exceeding the slow threshold (default 10ms). Investigate and optimize slow commands.
    - Expensive commands: Monitor for `KEYS`, `SMEMBERS` on large sets, `SORT` on large lists, `HGETALL` on large hashes — these block Redis and cause latency spikes for all clients.

34. **Design cache dashboards.** Build and maintain:

    **Dashboard 1: Cache Health Overview**
    - Overall hit rate (trending over hours, days).
    - Read/write latency percentiles (p50, p95, p99).
    - Memory utilization vs. limit.
    - Eviction rate.
    - Connected clients.
    - Commands per second.
    - Key count.

    **Dashboard 2: Cache Effectiveness**
    - Hit rate by key prefix / data type.
    - Cache miss penalty (latency of downstream fetches on miss).
    - Estimated database load saved by cache (cache_hits × estimated_db_query_time).
    - Data freshness: time since last invalidation/refresh for critical cached data.

    **Dashboard 3: Cache Infrastructure** (per node/shard)
    - CPU utilization per Redis instance.
    - Memory per node.
    - Network I/O per node.
    - Replication lag per replica.
    - Slow log entries.
    - Cluster slot distribution and migration status.

35. **Design cache alerting.** Define actionable alerts:

    **Critical (page — requires immediate response)**:
    - Cache service unreachable for > 30 seconds.
    - Memory utilization > 95% with `noeviction` policy (writes will fail).
    - Memory fragmentation ratio < 1.0 (swapping — severe performance degradation).
    - Hit rate drops below 50% for > 5 minutes (cache is effectively useless — all traffic hitting the database).
    - Replication lag > 30 seconds (data loss risk on failover).
    - All replicas disconnected from master.

    **Warning (ticket — investigate within business hours)**:
    - Hit rate drops below 80% for > 15 minutes.
    - Memory utilization > 80%.
    - Eviction rate > 100 keys/second sustained for > 10 minutes.
    - Cache read latency p99 > 5ms sustained for > 5 minutes.
    - Slow log entries increasing (> 10 slow commands per minute).
    - Connection count > 70% of `maxclients`.
    - Memory fragmentation ratio > 1.5.

    **Informational (dashboard/log)**:
    - Hit rate trends (weekly comparison).
    - Key count growth trends.
    - Command distribution changes (new command patterns appearing).

    Every critical alert must have a documented runbook.

### Phase 16: Cache Performance Tuning

36. **Tune Redis performance.** For Redis (the most common distributed cache), apply these configurations:

    **Connection management**:
    - `maxclients`: Set based on expected client count with headroom. Default: 10000. Ensure the OS `ulimit` for file descriptors is set higher.
    - Client-side connection pooling: Every application instance must use a connection pool (see database-performance skill principles). Pool size per instance: 5-20 connections for most applications. One connection can handle many commands via pipelining.
    - `timeout`: Set an idle connection timeout (e.g., 300 seconds) to reclaim connections from crashed or misconfigured clients.

    **Persistence tuning** (if persistence is enabled):
    - RDB: `save` intervals. For caches, less frequent saves are fine: `save 900 1` (save after 900 seconds if at least 1 key changed). Reduce to avoid I/O spikes on large datasets.
    - AOF: `appendfsync everysec` (recommended — fsync once per second, max 1 second of data loss on crash). `appendfsync always` (fsync every write — safest but slowest). `appendfsync no` (OS decides when to fsync — fastest, most data loss risk).
    - For pure caches where data can be reloaded from the source: disable persistence entirely (`save ""`, `appendonly no`) to maximize performance and eliminate I/O overhead.

    **Command optimization**:
    - **Use pipelining**: Batch multiple Redis commands into a single round-trip. Instead of 10 sequential `GET` commands (10 round-trips), pipeline them (1 round-trip). Reduces network overhead dramatically.
    - **Use `MGET`/`MSET`** for multiple key operations instead of individual `GET`/`SET` commands.
    - **Avoid blocking commands in production**: `KEYS *` (blocks Redis, use `SCAN` instead), `FLUSHALL`, `FLUSHDB` (use `UNLINK` for non-blocking delete), `DEBUG`, `SORT` on large datasets.
    - **Use `UNLINK` instead of `DEL`** for large values (> 1KB): `UNLINK` reclaims memory asynchronously in a background thread, while `DEL` blocks the main thread.
    - **Use Lua scripts** for atomic multi-step operations (check-and-set, conditional update, rate limiting) instead of multi-command sequences with `WATCH`/`MULTI`/`EXEC`. Lua scripts execute atomically on the server, eliminating race conditions.

    **Memory configuration**:
    - `maxmemory`: As discussed in step 22.
    - `maxmemory-policy`: As discussed in step 22.
    - `lazyfree-lazy-eviction yes`: Evict keys asynchronously in a background thread (prevents eviction from blocking the main thread).
    - `lazyfree-lazy-expire yes`: Expire keys asynchronously.
    - `lazyfree-lazy-server-del yes`: Background thread handles `DEL` of large keys internally.

37. **Tune application-level cache performance.**
    - **Measure serialization overhead**: Profile the time spent serializing and deserializing cached values. If serialization is a significant fraction of the total cache access time, switch to a faster format (MessagePack, Protocol Buffers) or cache pre-serialized responses.
    - **Measure network overhead**: The round-trip to the cache should be < 1ms within the same AZ. If it is higher, check: network configuration, instance placement (same AZ?), connection pooling, and TLS overhead (TLS adds ~0.5ms per connection establishment; use connection pooling to amortize).
    - **Pipeline and batch requests**: As discussed in step 36. Measure the impact of pipelining — it typically provides 3-10x throughput improvement.
    - **Avoid cache-on-read for every request**: Not every database query needs to be cached. Cache only queries that are: frequently repeated, expensive to execute, and tolerant of staleness. Caching cheap, infrequent queries adds complexity without meaningful benefit.

### Phase 17: Capacity Planning

38. **Perform cache capacity planning.** Size the cache infrastructure based on current and projected requirements:

    **Memory capacity**:
    - Calculate: `total_memory = key_count × (avg_key_size + avg_value_size + per_key_overhead)`.
    - Redis per-key overhead: approximately 50-100 bytes depending on data structure type.
    - Add 25-40% overhead for: Redis internal fragmentation, replication buffers, Lua script memory, client output buffers, and operating headroom.
    - Example: 1 million keys × (50 bytes key + 500 bytes value + 80 bytes overhead) = ~630 MB raw. With 30% overhead = ~820 MB. Round up to 1 GB `maxmemory`.
    - Project growth: If key count grows 10% per month, plan for 12-month capacity: 1 million × 1.1^12 = ~3.1 million keys = ~2.6 GB. Provision accordingly or plan a scaling action.

    **Throughput capacity**:
    - Redis single-threaded: A single Redis instance can handle 100,000-300,000 operations/second depending on operation type and value size (simple GET/SET with small values at the high end, complex commands with large values at the low end).
    - If projected throughput exceeds single-instance capacity, plan for Redis Cluster (horizontal scaling) or read replicas (read scaling).
    - Calculate: `peak_ops_per_second = (peak_requests_per_second × cache_operations_per_request)`. If each API request makes 3 cache operations, and peak traffic is 10,000 req/s, the cache sees 30,000 ops/s.

    **Network capacity**:
    - Calculate: `peak_bandwidth = peak_ops_per_second × avg_response_size`.
    - Example: 30,000 ops/s × 1 KB avg = 30 MB/s. Ensure the network interface and Redis instance's network allocation support this.

    **Connection capacity**:
    - Calculate: `max_connections = app_instances × pool_size_per_instance + monitoring_connections + admin_connections`.
    - Ensure `maxclients` accommodates this with 20% headroom.

### Phase 18: Cache Architecture Output and Deliverables

39. **Produce cache architecture deliverables.** At the conclusion of every caching design engagement, produce:

    - **Caching architecture summary**: A concise document stating the performance problem being solved, the caching strategy, technology selection, and key design decisions.
    - **Cache data catalog**: The complete list of cached data types with: source, access pattern, key design, TTL, invalidation strategy, consistency model, and estimated cardinality/memory (from steps 2 and 14).
    - **Cache key specification**: The key naming convention, key structure for each data type, and version/schema prefix strategy.
    - **Invalidation design**: The invalidation strategy for each data type (TTL, event-driven, version-based), with the specific events/mechanisms that trigger invalidation and the maximum staleness window.
    - **Failure handling design**: What happens when the cache is unavailable — fallback behavior, circuit breaker configuration, and graceful degradation plan.
    - **Cache warming plan**: How the cache is populated on cold start — passive vs. active warming, the hot set identification method, and the warming rate.
    - **Infrastructure specification**: Cache technology, instance type/size, topology (standalone, Sentinel, Cluster), persistence configuration, and managed service selection.
    - **Capacity estimate**: Memory, throughput, and connection requirements at current scale and projected growth.
    - **Monitoring and alerting specification**: Metrics to collect, dashboard design, alerting thresholds, and runbooks for critical alerts.
    - **HTTP caching specification** (if applicable): `Cache-Control`, `ETag`, `Vary` header values per endpoint, CDN configuration, and purge strategy.
    - **ADRs for caching decisions**: For each significant decision (technology selection, caching pattern, invalidation strategy, consistency tradeoff), a decision record with context, decision, alternatives considered, and consequences.
    - **Open questions**: Areas requiring further measurement, stakeholder input on consistency tolerance, or production traffic analysis before finalizing the design.

### Cross-Cutting Rules (Apply Throughout All Phases)

40. **Cache what you have measured, not what you assume.** Never add a cache layer based on the assumption that it will help. Measure the current performance, identify the specific bottleneck, verify that caching addresses it, implement the cache, and measure the improvement. If the cache does not provide measurable improvement, remove it — it is adding complexity without benefit.

41. **Every cache entry must have a TTL.** No exceptions. An entry without a TTL is a permanent, potentially stale copy of data that will never be refreshed. Even if other invalidation mechanisms exist (events, version changes), TTL is the safety net that prevents unbounded staleness when those mechanisms fail.

42. **Cache invalidation must be designed, not hoped for.** "We'll figure out invalidation later" is the most common caching mistake. Before caching any data, define: what triggers invalidation, how the invalidation is communicated, what the maximum staleness window is, and what happens if invalidation fails. If you cannot define the invalidation strategy, do not cache the data.

43. **The cache is an optimization, not a source of truth.** The data source (database, upstream service) is the system of record. The cache is a derived copy. If the cache and the source disagree, the source is correct. Design accordingly: reads fall through to the source on cache miss, writes go to the source first, and the system must function (degraded but correct) without the cache.

44. **Simplicity over cleverness.** A simple cache-aside strategy with TTL-based invalidation covers 80% of caching use cases. Multi-level caching, write-behind, refresh-ahead, tag-based invalidation, and distributed cache topologies are powerful but complex. Add complexity only when a specific, measured requirement demands it. Every layer of caching complexity adds invalidation challenges, failure modes, and operational burden.

45. **State tradeoffs explicitly.** Every caching decision involves a tradeoff between performance (lower latency, higher throughput), consistency (freshness of data), complexity (code, infrastructure, operational burden), cost (memory, compute, managed service fees), and reliability (additional failure modes). State the tradeoff for every recommendation: "Caching product catalog data with a 5-minute TTL reduces API latency from 180ms to 3ms and eliminates 99% of database load for this endpoint. The cost is that product updates (price changes, new descriptions) take up to 5 minutes to appear. This is acceptable because catalog updates happen 3-4 times per day during business hours, and the business has confirmed that a 5-minute delay is not customer-impacting."

46. **Monitor continuously and tune iteratively.** Caching is not a set-and-forget configuration. Access patterns change, data volumes grow, traffic patterns shift, and new features introduce new cached data types. Review cache metrics monthly: hit rate trends, memory growth, eviction patterns, and latency. Adjust TTLs, eviction policies, and capacity based on observed behavior, not initial assumptions.

47. **Make concrete recommendations, not option catalogs.** Do not say "you could use Redis or Memcached or an in-process cache." Say "Use Redis (ElastiCache) because you need data structures for rate limiting, TTL-based expiry, and pub/sub for cache invalidation — Memcached does not support these. Size the instance at `cache.r6g.large` (13.07 GB) based on the estimated 8 GB working set with 40% overhead. Use `allkeys-lfu` eviction policy because the product catalog access pattern has stable popularity distribution." When alternatives are close, state the recommendation and the specific conditions that would change it.
