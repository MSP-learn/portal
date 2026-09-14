# Azure Landing Zones

## What it is

An Azure Landing Zone is the foundation infrastructure for cloud adoption at
scale — the subscription architecture, governance, networking, identity, and
security baseline that every workload deploys onto.

```mermaid
graph TD
    subgraph "Management Group Hierarchy"
        subgraph "Root"
            MG1["Platform"]
            MG2["Landing Zones"]
            MG3["Sandbox"]
        end
        
        subgraph "Platform"
            CONN["Connectivity<br/>Subscription"]
            ID["Identity<br/>Subscription"]
            MGMT["Management<br/>Subscription"]
        end
        
        subgraph "Landing Zones"
            CORP["Corp - Production<br/>Subscriptions"]
            ONLINE["Online - Production<br/>Subscriptions"]
            NONPROD["Non-Production<br/>Subscriptions"]
        end
    end
```

## Architecture components

| Layer | Azure Service | Purpose |
| --- | --- | --- |
| **Identity** | Entra ID, PIM, Conditional Access | Centralized identity and access |
| **Connectivity** | Hub VNet, Azure Firewall, ExpressRoute, VPN | Network hub for all landing zones |
| **Management** | Log Analytics, Automation Account, Backup Vault | Monitoring, patching, backup |
| **Governance** | Azure Policy, RBAC, Blueprints, Defender | Guardrails and compliance |

## Enterprise-scale landing zone

```mermaid
graph TB
    subgraph "On-Premises"
        DC["Datacenter"]
    end
    
    subgraph "Connectivity Hub"
        ER["ExpressRoute Gateway"]
        VPN["VPN Gateway"]
        FW["Azure Firewall"]
        AD["Active Directory<br/>Domain Services"]
    end
    
    subgraph "Landing Zone - Corp"
        VNET1["Spoke VNet"]
        VM["VMs"]
        SQL["SQL Database"]
    end
    
    subgraph "Landing Zone - Online"
        VNET2["Spoke VNet"]
        FD["Front Door"]
        AS["App Service"]
        AKS["AKS"]
    end
    
    DC -->|"ExpressRoute"| ER
    ER --> FW
    VPN --> FW
    FW --> VNET1
    FW --> VNET2
```

## Deployment options

| Approach | Tooling | When to use |
| --- | --- | --- |
| Azure Portal Quick Start | Portal wizard | First-time, simple setup |
| ARM/Bicep templates | Infrastructure as Code | Customization needed |
| Terraform modules | HashiCorp Terraform | Multi-cloud existing TF |
| Azure CLI / PowerShell | Scripted automation | Automated pipelines |

## Decision: Hub-spoke vs. Virtual WAN

| Factor | Hub-spoke | Virtual WAN |
| --- | --- | --- |
| Complexity | Moderate | Higher (managed) |
| Control | Full control over hub | Microsoft-managed |
| Scale | 100s of spokes | 1000s of spokes |
| Global routing | Manual | Automatic |
| Cost | Predictable | Higher at small scale |

## Related terms

- [Network Topologies](network-topologies.md)
- [Identity Architecture](identity-architecture.md)
- [Azure Policy and Governance](../../docs/concepts/governance.md)
- [Glossary: Hub-spoke](../../docs/glossary/README.md#hub-spoke)
