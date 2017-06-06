---
title: Deploy a VNet Using Building Block Template
description: Deploy a virtual network (VNet) using Azure Resource Manager template building block
author:
---

# Deploy an Azure Virtual Network

The virtual network (VNet) template building block deploys the [Azure VNet resource][azure-vnet-overview]. You can specify multiple VNets, subnets, peerings, and custom DNS settings.

## Architecture

A VNet is a logically isolated network in Azure attached to a single Azure subscription. When you deploy a VNet, you specify the following:

* Address space: the range of IP addresses included in the VNet.
* Subnet name and address range: name and range of a network segment within the VNet.
* Peerings: VNets within the same Azure region can be peered together, and all network communication between them is passed over the Azure backbone network.
* DNS servers: by default, DNS resolution is handled by Azure DNS servers. You can specify a custom DNS server.

## Recommendations

Create a VNet with an address space large enough for all of your required resources. Ensure that the VNet address space has sufficient room for growth if additional resources are likely to be needed in the future. (from hybrid networking vpn RA)

If your network is a hybrid network, the address space of the VNet must not overlap with the on-premises network. (from hybrid networking vpn RA)

For more information about designing your VNet, set [plan and design Azure Virtual Networks][plan-and-design-vnet].

## Security Considerations

By default, all inbound and outbound traffic within a VNet is allowed. We recommend you use network security groups to specify security rules to only allow expected network traffic within the VNet.

## 



<!-- links -->
[azure-limits]: /azure/azure-subscription-service-limits
[azure-vnet-overview]: /azure/virtual-network/virtual-networks-overview
[plan-and-design-vnet]: /azure/virtual-network/virtual-network-vnet-plan-design-arm