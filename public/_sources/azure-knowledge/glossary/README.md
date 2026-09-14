# System Design Glossary — Azure Edition

System design and distributed systems terminology mapped to Azure services.
Each term links theory to concrete Azure implementation.

---

## A

### Active-Active
A deployment where multiple regions serve traffic simultaneously.
- **Azure:** Front Door + Cosmos DB multi-master + active-active App Service deployments

### Active-Passive (Active-Standby)
Primary region serves traffic; secondary region stays idle until failover.
- **Azure:** SQL Database failover groups, Site Recovery

### Anti-Corruption Layer
A translation layer between different bounded contexts or legacy systems.
- **Azure:** API Management policies, Azure Functions as adapters

### AP (Availability + Partition Tolerance)
A CAP theorem category: the system stays available even if the network partitions, but may return stale data.
- **Azure:** Cosmos DB (AP mode), Azure Cache for Redis

### Auto-scaling
Dynamically adjusting compute resources based on load.
- **Azure:** VMSS, App Service Autoscale, AKS HPA + KEDA, Functions (consumption plan)

### Availability (System Design)
The percentage of time a system is operational and accessible (usually measured as "nines").
- **Azure SLA:** 99.9% (3 nines) to 99.995% (4.5 nines) depending on service configuration
- **Formula:** `Uptime / (Uptime + Downtime)`

### Availability Set
Logical grouping of VMs to protect against rack-level failures.
- **Azure:** 2+ VMs in an availability set = 99.95% SLA

### Availability Zone
Physically separate datacenter within a region.
- **Azure:** 3 per supported region, ~1-2 ms latency between zones

---

## B

### Backpressure
A mechanism to regulate data flow when a downstream system is overwhelmed.
- **Azure:** Service Bus sessions, Event Hubs throttling, Functions concurrency limits

### Bastion Host
A hardened VM that serves as the entry point to a private network.
- **Azure:** Azure Bastion (fully managed PaaS)

### Blue-Green Deployment
Two identical environments: one live (blue), one staging (green). Switch traffic instantly.
- **Azure:** App Service deployment slots, Front Door, Traffic Manager

### Bounded Context
A logical boundary in Domain-Driven Design where a specific domain model applies.
- **Azure:** API Management products, separate AKS namespaces, separate subscriptions

### Bulkhead Pattern
Isolating resources into pools so a failure in one pool doesn't cascade.
- **Azure:** AKS node pools, separate App Service plans, separate Service Bus namespaces

---

## C

### Cache-Aside
An application pattern where the app checks cache before reading from the database.
- **Azure:** Azure Cache for Redis + any database

```python
# Pseudocode
def get_user(user_id):
    user = cache.get(f"user:{user_id}")
    if not user:
        user = db.query("SELECT * FROM users WHERE id = ?", user_id)
        cache.set(f"user:{user_id}", user, ttl=300)
    return user
```

### CAP Theorem
A distributed system can only guarantee two of three: Consistency, Availability, Partition Tolerance.
- **CP (Consistency + Partition Tolerance):** Azure SQL Database, Cosmos DB (Strong consistency)
- **AP (Availability + Partition Tolerance):** Cosmos DB (Eventual consistency), Azure Cache

### CQRS (Command Query Responsibility Segregation)
Separating read and write operations into different models.
- **Azure:** Azure Functions (commands) + Cosmos DB change feed (projections) + Azure Cache (reads)

### Circuit Breaker
Prevents repeated calls to a failing service, giving it time to recover.
- **Azure:** App Service health checks, Application Insights, Istio/Envoy in AKS

### Claim Check
Store large messages in blob storage, pass a reference through the message bus.
- **Azure:** Service Bus message with large payload stored in Blob Storage

### Consistency (System Design)
Every read returns the most recent write or an error.
- **Strong:** SQL Database, Cosmos DB (Strong), Azure Table Storage
- **Eventual:** Cosmos DB (Eventual), Cache for Redis
- **Consistent Prefix:** Cosmos DB (Consistent Prefix, Bounded Staleness)

### Container Orchestration
Automated deployment, scaling, and management of containers.
- **Azure:** Azure Kubernetes Service (AKS), Container Instances, Container Apps

### Content Delivery Network (CDN)
A geographically distributed network of proxy servers and their data centers.
- **Azure:** Azure CDN (from Microsoft), Azure Front Door, Azure Storage static websites + CDN

### Correlation ID
A unique identifier passed across service boundaries to trace a request end-to-end.
- **Azure:** Application Insights (operation_Id, operation_ParentId), custom HTTP headers

---

## D

### Database Migration
Moving data from one database platform to another.
- **Azure:** Azure Database Migration Service, Data Factory, SQL Migration Extension

### Data Lake
Storage repository that holds vast amounts of raw data in native format.
- **Azure:** Azure Data Lake Storage Gen2 (built on Blob Storage + hierarchical namespace)

### Dead Letter Queue
A queue for messages that cannot be processed successfully.
- **Azure:** Service Bus dead-letter queue, Storage Queue (poison messages)

### Delegation of Trust
Passing authentication/authorization trust from one service to another.
- **Azure:** Managed Identities, OAuth 2.0 On-Behalf-Of flow in Entra ID

### Distributed Tracing
Tracking a request through multiple services in a distributed system.
- **Azure:** Application Insights (distributed tracing), OpenTelemetry

---

## E

### Event Sourcing
Storing state changes as a sequence of events rather than current state.
- **Azure:** Cosmos DB change feed, Event Hubs capture, Azure Functions

### Eventually Consistent
Given enough time without updates, all replicas converge to the same value.
- **Azure:** Cosmos DB (Eventual consistency), CDN propagation, DNS propagation

### ExpressRoute
A dedicated private connection from on-premises to Azure.
- **Azure:** ExpressRoute (bypasses the public internet)

---

## F

### Failover
Automatic or manual switch to a secondary system when the primary fails.
- **Azure:** SQL Database failover groups, Cosmos DB multi-region writes, Site Recovery

### Fan-Out / Fan-In
Broadcasting a message to multiple handlers (fan-out) then aggregating results (fan-in).
- **Fan-out Azure:** Event Grid, Event Hubs, Service Bus topics
- **Fan-in Azure:** Azure Functions, Logic Apps, Durable Functions

### Fault Domain
A group of hardware that shares a single point of failure.
- **Azure:** By default 2 fault domains per availability set, 3 per availability zone

### Function-as-a-Service (FaaS)
Run code in stateless containers triggered by events, with automatic scaling.
- **Azure:** Azure Functions (consumption, premium, dedicated plans)

---

## G

### Geo-Redundancy
Replicating data across geographically separated regions.
- **Azure:** GRS (Geo-Redundant Storage), Cosmos DB multi-region, SQL Geo-Replication

### Graceful Degradation
When a non-critical feature fails, the system continues without it.
- **Azure:** App Service health checks + circuit breaker, Front Door + origin groups

---

## H

### Health Probe / Health Check
An endpoint or process that reports whether a service is functioning.
- **Azure:** App Service health check, Load Balancer health probes, AKS liveness/readiness probes

### Horizontal Scaling (Scaling Out)
Adding more instances of a resource to handle increased load.
- **Azure:** VMSS, App Service scale-out, AKS HPA, Functions consumption plan

### Hub and Spoke
Network topology with a central hub VNet connected to multiple spoke VNets.
- **Azure:** Hub VNet (Firewall, Gateway) + peered spoke VNets

---

## I

### Idempotency
An operation that produces the same result no matter how many times it's executed.
- **Azure:** ARM/Bicep (declarative), Service Bus duplicate detection, Storage Blob PUT semantics

### Idle Connection
A network connection that has no active data transfer.
- **Azure:** Azure Load Balancer idle timeout (default 4 min, configurable up to 30 min)

### Infrastructure as Code (IaC)
Managing infrastructure through machine-readable definition files.
- **Azure:** ARM templates, Bicep, Terraform, Pulumi, Azure CLI

---

## J

### Just-in-Time (JIT) Access
Temporary elevation of privileges for specific tasks.
- **Azure:** Microsoft Entra Privileged Identity Management (PIM), Defender for Cloud JIT VM access

---

## K

### Key Rotation
Periodically replacing cryptographic keys to limit exposure.
- **Azure:** Key Vault key rotation policy, Key Vault + Managed HSM

### Kubernetes
Container orchestration platform for automating deployment, scaling, and management.
- **Azure:** Azure Kubernetes Service (AKS), Azure Arc-enabled Kubernetes

---

## L

### Latency
The time it takes for data to travel from source to destination.
- **Azure:** ~1-2 ms intra-region, ~10-100 ms inter-region (US), higher globally

### Load Balancing
Distributing incoming traffic across multiple backend servers.
- **Azure L4:** Azure Load Balancer (internal/external)
- **Azure L7:** Application Gateway, Front Door, Traffic Manager (DNS)

### Locks (Distributed)
Preventing concurrent access to a shared resource across multiple processes.
- **Azure:** Azure Blob Storage lease, Cosmos DB optimistic concurrency (etag)

---

## M

### Materialized View
A pre-computed query result stored for fast read access.
- **Azure:** Cosmos DB change feed → Azure Functions → cache or secondary collection

### Message Broker
Middleware that enables asynchronous communication between services.
- **Azure:** Service Bus, Event Hubs, Event Grid, Storage Queues

### Microservices
An architectural style that structures an application as a collection of small, loosely coupled services.
- **Azure:** AKS, Container Apps, Service Fabric, API Management + Functions

### Multi-tenancy
A single instance of software serving multiple tenants, each isolated from others.
- **Azure:** Azure itself is multi-tenant; SaaS on Azure uses subscription/resource group isolation

---

## N

### Namespace
A logical container for resources that provides isolation.
- **Azure:** Service Bus namespace, Event Hubs namespace, AKS namespace, DNS zone

### N-tier Architecture
Layered architecture with presentation, application, and data tiers.
- **Azure:** Front Door → App Service → SQL Database (3-tier), App Gateway → VM → SQL Always On

---

## O

### Observability
The ability to measure a system's internal state from its external outputs.
- **Three pillars:** Metrics, Logs, Traces
- **Azure:** Azure Monitor, Application Insights, Log Analytics, Prometheus + Grafana (AKS)

### Orchestration (Microservices)
Coordinating the execution of multiple services or functions to complete a workflow.
- **Azure:** Durable Functions (orchestrator), Logic Apps, AKS, Azure Data Factory

---

## P

### Partition (Database)
Dividing a database into smaller, manageable pieces.
- **Azure:** Cosmos DB (logical partitions), SQL Database (sharding, table partitioning)

### Partition Key
The key used to distribute data across partitions.
- **Azure:** Cosmos DB partition key selection is critical for performance and cost

### Pattern: Ambassador
Proxy sidecar that handles cross-cutting concerns (retries, circuit breaking, auth).
- **Azure:** Istio/Envoy (AKS), Application Gateway (reverse proxy)

### Pattern: Saga
A sequence of local transactions where each publishes an event to trigger the next.
- **Azure:** Durable Functions (chaining, fan-out/fan-in), Service Bus + Functions

### Pattern: Sidecar
A co-located helper process that extends or enhances the main container.
- **Azure:** AKS sidecar pattern (Envoy, Fluentd, Key Vault FlexVolume)

### Pattern: Strangler Fig
Gradually replacing a legacy system by routing functionality to new services.
- **Azure:** Front Door + App Service routing, API Management + Function Apps

### Private Endpoint
Network interface that connects privately to an Azure service via a private IP.
- **Azure:** Private Link (private endpoint), Private DNS zones

### Proximity Placement Group
Grouping VMs close together for low-latency communication.
- **Azure:** Proximity Placement Groups

---

## Q

### Queue
A buffer that decouples message producers from consumers.
- **Azure:** Azure Queue Storage, Service Bus Queue, Event Hubs

### Quorum
The minimum number of nodes that must agree on a value in a distributed system.
- **Azure:** Cosmos DB (configurable consistency), SQL Always On Availability Groups

---

## R

### Rate Limiting
Controlling the rate of traffic sent or received.
- **Azure:** API Management (rate limit, quota policies), Front Door WAF rate limiting

### Read Replica
A read-only copy of a database for offloading read traffic.
- **Azure:** SQL Database read scale-out, Cosmos DB read regions, PostgreSQL read replicas

### Retry Pattern
Reattempting a failed operation, typically with exponential backoff.
- **Azure:** .NET SDK retry policies, Polly library, Application Insights automatic retries

### Reverse Proxy
A server that sits in front of backend services and forwards client requests.
- **Azure:** Application Gateway, Azure Front Door, NGINX (AKS/VM)

### RBAC (Role-Based Access Control)
Authorization system that grants permissions based on assigned roles.
- **Azure:** Azure RBAC (IAM), Entra ID RBAC, custom roles

### RTO / RPO
- **RTO (Recovery Time Objective):** Maximum acceptable downtime
- **RPO (Recovery Point Objective):** Maximum acceptable data loss
- **Azure:** Site Recovery (RTO minutes, RPO seconds), SQL Geo-Replication (RPO < 5s)

---

## S

### Saga Pattern
A sequence of local transactions that are coordinated via events or a choreographer.
- **Choreography:** Service Bus + Event Grid
- **Orchestration:** Durable Functions, Logic Apps

### Scale Set
A group of identical, auto-scaling VMs.
- **Azure:** Virtual Machine Scale Sets (VMSS)

### Service Principal
An identity created for use with applications, services, and automation tools.
- **Azure:** App registrations, service principals in Entra ID

### Sharding
Horizontal partitioning of data across multiple independent databases.
- **Azure:** SQL Database elastic scale (sharding), Cosmos DB (partitioning)

### Shutdown (Graceful)
Allowing in-flight requests to complete before stopping a service.
- **Azure:** AKS pod graceful shutdown (preStop hook), App Service auto swap

### SLA (Service Level Agreement)
The guaranteed level of service availability.
- **Azure:** 99.9% to 99.995% depending on service and configuration
- **Composite SLA:** `SLA_A × SLA_B` for dependent services

### SNAT (Source Network Address Translation)
Mapping a private IP to a public IP for outbound traffic.
- **Azure:** Azure Load Balancer outbound rules, NAT Gateway, VNet NAT

### Stateful vs Stateless
- **Stateful:** Maintains session state across requests
  - **Azure:** Stateful services (Service Fabric), VM with local disks, session affinity (ARR)
- **Stateless:** No session state stored on the server
  - **Azure:** Functions (default), App Service (stateless), AKS stateless workloads

### Static Web App
A pre-rendered web application served from a global edge network.
- **Azure:** Static Web Apps (hosted by Azure), Blob Storage static website

### Sticky Session (Session Affinity)
Routing requests from the same client to the same backend server.
- **Azure:** App Service ARR affinity, Application Gateway session affinity

### Strangler Fig
Gradually replace a monolithic application by incrementally replacing specific functions.
- **Azure:** Front Door routing rules, API Management incremental migration

---

## T

### Throttling
Limiting the number of requests a service processes to protect itself.
- **Azure:** Event Hubs (throughput units), Functions (concurrency), API Management (rate limit), Cosmos DB (RU/s)

### Throughput
The rate at which a system processes requests (requests per second, MB/s, etc.).
- **Azure:** Cosmos DB RU/s, Event Hubs throughput units, Storage account limits

### Timeout
The maximum time a system waits for an operation to complete.
- **Azure:** Load Balancer idle timeout (4-30 min), Functions functionTimeout (5-10 min), ARM deployment timeout

### TLS/SSL Termination
Decrypting TLS at a load balancer so backend services receive plain HTTP.
- **Azure:** Application Gateway, Front Door, Load Balancer + self-managed proxy

### Traffic Manager
DNS-based traffic routing across global Azure regions.
- **Azure:** Traffic Manager (routing methods: performance, priority, weighted, geographic)

---

## U

### Update Domain
A logical group of VMs that are updated together during planned maintenance.
- **Azure:** Default 5 update domains per availability set (max 20)

### Unit Testing (Cloud)
Testing a single component in isolation.
- **Azure:** No specific Azure service; standard test frameworks + Azurite (local storage emulator), Functions host

---

## V

### Vertical Scaling (Scaling Up)
Adding more power (CPU, RAM, disk) to an existing instance.
- **Azure:** Resize VM, scale up App Service plan, increase Cosmos DB RU/s

### Virtual Network (VNet)
An isolated network in Azure, equivalent to a traditional on-premises network.
- **Azure:** VNet, subnets, peering, NSG, ASG, VNet integration (App Service, Functions)

### Virtual WAN
Managed global transit network architecture in Azure.
- **Azure:** Virtual WAN (Microsoft-managed hub-spoke at global scale)

---

## W

### Web Application Firewall (WAF)
Filters and monitors HTTP traffic to protect web applications.
- **Azure:** Front Door WAF, Application Gateway WAF, Azure WAF policy

### Well-Architected Framework
Microsoft's set of guiding tenets for building high-quality cloud workloads.
- **Azure:** [Well-Architected Review](../concepts/azure-well-architected.md)
- **Pillars:** Reliability, Security, Cost Optimization, Operational Excellence, Performance Efficiency

### Workload
A discrete set of Azure resources that work together to support a specific function.
- **Azure:** Workloads are the unit of the Well-Architected Review

---

## Z

### Zero Trust
Security model: "never trust, always verify" — no implicit trust based on network location.
- **Azure:** Entra ID Conditional Access, Defender for Cloud, Azure Policy, Just-in-Time access

### Zone-Redundant
Service that replicates across multiple Availability Zones automatically.
- **Azure:** Cosmos DB, Event Hubs, AKS, SQL Database (zone-redundant)

---

## Contribution

Add terms alphabetically. Each entry:
- **Term** — system design term
- **Definition** — one-line plain English
- **Azure mapping** — which Azure services implement this pattern
