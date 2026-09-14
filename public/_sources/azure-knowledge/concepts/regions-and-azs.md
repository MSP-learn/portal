# Azure Regions and Availability Zones

## What it is

Azure Regions are geographic areas that contain one or more datacenters connected
through a dedicated regional low-latency network. Availability Zones (AZs) are
physically separate locations within an Azure region, each with independent power,
cooling, and networking.

```mermaid
graph TD
    subgraph "Azure Region (eastus)"
        AZ1["Availability Zone 1<br/>(datacenter)"]
        AZ2["Availability Zone 2<br/>(datacenter)"]
        AZ3["Availability Zone 3<br/>(datacenter)"]
    end
    
    subgraph "Azure Region (westus)"
        AZ4["Availability Zone 1"]
        AZ5["Availability Zone 2"]
        AZ6["Availability Zone 3"]
    end
    
    AZ1 <--> AZ2 <--> AZ3
    AZ4 <--> AZ5 <--> AZ6
    
    eastus -- "ExpressRoute / VPN" --> westus
```

## Key facts

- **160+** Azure Regions worldwide (most of any cloud provider)
- **3 Availability Zones** per supported region (minimum)
- **Paired regions** for geo-redundancy (e.g., East US × West US)
- **Region pairs** are at least 300 miles apart (in the US)
- **Some services** are zone-redundant by default (AKS, Cosmos DB)
- **Some services** require explicit zone configuration (VMs, managed disks)

## Service categories by availability

| Category | Behavior | Examples |
| --- | --- | --- |
| Zonal | Deployed to a specific zone, survive other zones | VMs, Disks, IP addresses |
| Zone-redundant | Replicated across zones automatically | Cosmos DB, Event Hubs, AKS |
| Regional | No zone awareness, survives region-level failure | App Service, Functions, SQL Database |
| Global | Spans multiple regions globally | Traffic Manager, Front Door, DNS |

## Diagram: Multi-region active-active architecture

```mermaid
graph LR
    Users --> FD["Azure Front Door<br/>(Global Load Balancer)"]
    
    subgraph "Region 1 - East US"
        FD --> AG1["Application Gateway"]
        AG1 --> AS1["App Service (Plan)"]
        AS1 --> SQL1["SQL Database<br/>Primary"]
    end
    
    subgraph "Region 2 - West US"
        FD --> AG2["Application Gateway"]
        AG2 --> AS2["App Service (Plan)"]
        AS2 --> SQL2["SQL Database<br/>Readable Secondary"]
    end
    
    SQL1 --> SQL2["Failover Group"]
```

## Choosing regions

1. **Proximity to users** — lowest latency for your audience
2. **Service availability** — not all services are in all regions
3. **Zone support** — some regions have 3 AZs, some have none
4. **Compliance and data residency** — sovereign regions, data boundaries
5. **Cost** — pricing varies by region

## Related terms

- [Resource Hierarchy](resource-hierarchy.md)
- [Azure Resource Manager](azure-resource-manager.md)
- [Glossary: Geo-redundancy](../glossary/README.md#geo-redundancy)
