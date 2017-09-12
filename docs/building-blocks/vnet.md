---
title: Deploy a VNet Using Azure Building Blockse
description: Deploy a virtual network (VNet) using Azure Building Blocks
author:
---

# Deploy an Azure Virtual Network

The virtual network (VNet) building block deploys the [Azure VNet resource][azure-vnet-overview]. You can specify multiple VNets, subnets, peerings, and custom DNS settings.

## Architecture

A VNet is a logically isolated network in Azure attached to a single Azure subscription. When you deploy a VNet, you specify the following:

* Address space: the range of IP addresses included in the VNet.
* Subnet name and address range: name and range of a network segment within the VNet.
* Peerings: VNets within the same Azure region can be peered together, and all network communication between them is passed over the Azure backbone network. 
* DNS servers: by default, DNS resolution is handled by Azure DNS servers. You can specify a custom DNS server.

## Recommendations

Create a VNet with an address space large enough for all of your required resources. Ensure that the VNet address space has sufficient room for growth if additional resources are likely to be needed in the future. If your network is a hybrid network, the address space of the VNet must not overlap with the on-premises network. 

Ensure that your subnet address spaces do not overlap. Azure Resource Manager will return an error if you attempt to provision subnets with overlapping address spaces.

You can specify custom DNS servers for name resolution within the Vnet. If you do not specify a DNS server, Azure DNS will be used by default. 

For more information about designing your VNet, set [plan and design Azure Virtual Networks][plan-and-design-vnet].

## Peering

There are several ways to connect VNets together:

1. Peering
2. VPN Gateway
3. ExpressRoute Gateway

## Security Considerations

By default, all inbound and outbound traffic within a VNet is allowed. We recommend you use network security groups to specify security rules to only allow expected network traffic within the VNet.

## Tutorial: Deploying a Vnet

You can use the Azure Building Blocks project to quickly deploy a VNet. If you are not familiar with the Azure Building Blocks, we suggest you read the introduction on the wiki, then install Azure Building Blocks and learn how to create an Azure Building Blocks parameter file. 

When you cloned the Azure Building Blocks repository, you also cloned a copy of the scenarios folder that contains a number of pre-built example parameter files. Navigate to the `/scenarios` folder and then to the `/vnet` folder. Let's take a look at the most basic Vnet parameter file, `vnet-simple.json` first.

The `vnet-simple.json` parameter file specifies the following parameters:

```json
{
  "type": "VirtualNetwork",
  "settings": [
    {
      "name": "msft-simple-vnet",
      "addressPrefixes": [
        "10.0.0.0/16"
       ],
       "subnets": [
         {
           "name": "subnet1",
           "addressPrefix": "10.0.0.0/16"
         }
        ]
     }
  ]
}
```

In Azure, each resource requires a name to uniquely identify the resource within a resource group. In Azure Building Blocks, you specify a `name` property for each resource type. In this example, we have specified a value of `msft-simple-vnet` for our Vnet. When we deploy this parameter file using the command line tool and Azure Resource Manager deploys the Vnet, this is the nane that we will see in the Azure portal user interface.

Next we specify the virtual network address 



<!-- links -->
[azure-limits]: /azure/azure-subscription-service-limits
[azure-vnet-overview]: /azure/virtual-network/virtual-networks-overview
[plan-and-design-vnet]: /azure/virtual-network/virtual-network-vnet-plan-design-arm