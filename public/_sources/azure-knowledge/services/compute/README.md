# Azure Compute

## Decision tree: Which compute service?

```mermaid
flowchart TD
    Start{"What do you need?"}
    Start --> Q1{"Full control of OS?"}
    Q1 -->|"Yes"| Q2{"Need<br/>autoscaling?"}
    Q1 -->|"No"| Q3{"Just run code?"}
    
    Q2 -->|"Yes"| VMSS["Virtual Machine<br/>Scale Sets"]
    Q2 -->|"No"| VM["Virtual Machines"]
    
    Q3 -->|"Just code"| Q4{"Event-driven?"}
    Q3 -->|"Container"| AKS["Azure Kubernetes<br/>Service (AKS)"]
    Q3 -->|"Web app"| AS["App Service"]
    
    Q4 -->|"Yes"| AF["Azure Functions"]
    Q4 -->|"No"| ACI["Container Instances"]
```

## Services

| Service | Best for | Management level | Scaling |
| --- | --- | --- | --- |
| **Virtual Machines** | Full OS control, legacy apps, custom software | IaaS | Manual / VMSS |
| **App Service** | Web apps, REST APIs, mobile backends | PaaS | Built-in auto |
| **Azure Functions** | Event-driven, short-running, serverless | Serverless | Auto (consumption) |
| **AKS** | Kubernetes orchestration, microservices | PaaS / Orchestrated | Cluster + HPA |
| **Container Instances** | Simple containers, batch jobs, CI runners | Serverless | Per-instance |
| **Container Apps** | Microservices, KEDA-driven event scaling | PaaS / Serverless | Auto + KEDA |
| **Azure Batch** | Large-scale parallel batch computing | Managed | Job-level |

## Service deep dives

- [Virtual Machines](virtual-machines.md)
- [App Service](app-service.md)
- [Azure Functions](functions.md)
- [Azure Kubernetes Service](aks.md)
