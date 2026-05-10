export interface ArchitecturePattern {
    title: string;
    description: string;
}

export const architecturePatterns: ArchitecturePattern[] = [
    {
        title: "Load Balancer",
        description:
            "A load balancer distributes incoming network traffic across multiple servers to ensure no single server bears too much demand. It improves application availability, scalability, and fault tolerance. Common algorithms include round-robin, least connections, and IP hash. Hardware load balancers (F5, Citrix) and software load balancers (Nginx, HAProxy, AWS ALB/NLB) are widely used. Layer 4 load balancers operate at the transport level, while Layer 7 load balancers can make routing decisions based on HTTP headers, cookies, or URL paths. Health checks continuously monitor backend servers and remove unhealthy instances from the pool. Session persistence (sticky sessions) can be configured when stateful connections are required. Global server load balancing (GSLB) extends this concept across data centers for disaster recovery and geographic distribution.",
    },
    {
        title: "Microservices",
        description:
            "Microservices architecture decomposes a monolithic application into small, independently deployable services, each responsible for a specific business capability. Each service runs in its own process, communicates via lightweight protocols (REST, gRPC, or messaging), and can be developed, deployed, and scaled independently. Key principles include single responsibility, bounded contexts from Domain-Driven Design, decentralized data management (each service owns its database), and infrastructure automation. Service discovery (Consul, Eureka) enables dynamic routing. API gateways aggregate requests and handle cross-cutting concerns like authentication and rate limiting. Circuit breakers (Hystrix, Resilience4j) prevent cascading failures. Container orchestration (Kubernetes, Docker Swarm) manages deployment, scaling, and networking. Observability through distributed tracing (Jaeger, Zipkin), centralized logging (ELK stack), and metrics (Prometheus, Grafana) is essential for operating microservices at scale.",
    },
    {
        title: "Event Driven Architecture",
        description:
            "Event-Driven Architecture (EDA) is a design paradigm where the flow of the program is determined by events — significant changes in state. Producers emit events without knowing who will consume them, and consumers react to events they are interested in. This decoupling enables highly scalable, loosely coupled systems. Core patterns include event notification (simple alerts), event-carried state transfer (events contain full state), and event sourcing (storing all state changes as an immutable sequence of events). Message brokers like Apache Kafka, RabbitMQ, AWS SNS/SQS, and Azure Event Hubs facilitate event distribution. Event schemas should be versioned for backward compatibility. CQRS often pairs with EDA to separate read and write models. Saga patterns (choreography or orchestration) coordinate distributed transactions across services. Dead letter queues handle failed event processing, and idempotent consumers prevent duplicate processing.",
    },
    {
        title: "CQRS",
        description:
            "Command Query Responsibility Segregation (CQRS) separates the read (query) side from the write (command) side of an application. The write model handles commands that change state, enforcing business rules and validations. The read model is optimized for queries and can use denormalized views, materialized views, or dedicated read databases. This separation allows independent scaling — read-heavy workloads can scale read replicas, while writes go to the primary. CQRS pairs naturally with Event Sourcing, where commands produce events that update both the write store and read projections. Eventual consistency between read and write models must be managed carefully. Benefits include performance optimization, simplified query logic, and better separation of concerns. Implementation frameworks include Axon (Java), MediatR (.NET), and custom implementations with message brokers. The pattern adds complexity and is best suited for domains with complex business logic or vastly different read/write patterns.",
    },
    {
        title: "API Gateway",
        description:
            "An API Gateway is a single entry point for all client requests in a microservices architecture. It acts as a reverse proxy, routing requests to appropriate backend services. Key capabilities include request routing, API composition (aggregating multiple service responses into one), authentication and authorization (JWT/OAuth2 validation), rate limiting and throttling, request/response transformation, caching, SSL termination, and protocol translation. Popular implementations include Kong, AWS API Gateway, Azure API Management, Apigee, Traefik, and custom gateways built with Express.js or Spring Cloud Gateway. The Backend-for-Frontend (BFF) pattern uses separate gateways tailored for different client types (web, mobile, IoT). API gateways also handle API versioning, circuit breaking, and observability through access logging and metrics collection. They can implement canary deployments and A/B testing at the routing level.",
    },
    {
        title: "Cache Aside",
        description:
            "Cache-Aside (also called Lazy Loading) is a caching strategy where the application is responsible for reading from and writing to the cache. On a read, the app checks the cache first. On a cache miss, it reads from the database, stores the result in the cache, and returns it. On a write, the app updates the database and invalidates or updates the cache entry. This pattern gives full control over what gets cached and when. Alternative strategies include Write-Through (cache is updated synchronously with the database), Write-Behind (cache is updated first, database asynchronously), and Read-Through (cache layer handles database reads transparently). Redis and Memcached are the most common cache stores. Key considerations include TTL (Time-To-Live) policies, cache eviction strategies (LRU, LFU, FIFO), cache stampede prevention (locking, probabilistic early expiration), data serialization formats, and cache partitioning for large datasets. Multi-tier caching (L1 in-memory, L2 distributed) provides both speed and capacity.",
    },
    {
        title: "Message Queue",
        description:
            "A Message Queue is an asynchronous communication mechanism that decouples producers and consumers. Producers send messages to a queue, and consumers process them at their own pace. This enables reliable delivery, load leveling, and temporal decoupling. Point-to-point queues deliver each message to exactly one consumer, while publish-subscribe (pub/sub) topics deliver copies to all subscribers. Key features include guaranteed delivery, message ordering (FIFO), message deduplication, dead letter queues for failed messages, message priority, delayed/scheduled delivery, and message batching. Popular implementations include RabbitMQ (AMQP-based, feature-rich), Apache Kafka (distributed log for high-throughput streaming), AWS SQS/SNS, Azure Service Bus, and Google Cloud Pub/Sub. Message serialization formats include JSON, Protocol Buffers, Avro, and MessagePack. Backpressure mechanisms prevent consumer overload, and consumer groups enable parallel processing with partition-based load balancing.",
    },
    {
        title: "Distributed Cache",
        description:
            "A Distributed Cache stores data across multiple nodes in a cluster, providing high availability, fault tolerance, and horizontal scalability for frequently accessed data. Unlike local in-process caches, distributed caches are shared across application instances, ensuring consistency. Redis Cluster and Memcached are leading implementations. Data partitioning uses consistent hashing to distribute keys across nodes, minimizing rehashing when nodes are added or removed. Replication provides redundancy — Redis supports master-replica with automatic failover via Redis Sentinel or Redis Cluster. Cache topologies include client-side caching, server-side caching, and CDN caching. Key strategies include cache warming (preloading hot data), cache invalidation patterns (TTL, event-driven, versioned keys), and cache penetration protection (bloom filters, null caching). Serialization performance matters at scale — binary formats like Protocol Buffers outperform JSON. Monitoring cache hit rates, memory usage, and eviction rates is critical for tuning.",
    },
    {
        title: "Database Sharding",
        description:
            "Database Sharding horizontally partitions data across multiple database instances (shards), where each shard holds a subset of the total data. This enables systems to scale beyond the capacity of a single database server. Sharding strategies include range-based (partitioning by key ranges), hash-based (using a hash function on the shard key for uniform distribution), directory-based (a lookup table maps keys to shards), and geographic (data stored near users). Choosing the right shard key is critical — it should distribute data evenly and align with query patterns to minimize cross-shard queries. Challenges include cross-shard joins (often avoided by denormalization), distributed transactions (2PC or saga patterns), rebalancing when adding shards, schema migrations across shards, and maintaining global uniqueness (UUID, Snowflake IDs). Tools like Vitess (MySQL), Citus (PostgreSQL), MongoDB native sharding, and CockroachDB automate much of the complexity. Connection pooling (PgBouncer, ProxySQL) and query routing layers sit in front of shards to direct traffic.",
    },
];
