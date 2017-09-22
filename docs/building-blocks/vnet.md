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

Ensure that your subnet address spaces do not overlap. If you attempt to provision subnets with overlapping address spaces, Azure Resource Manager will return an error. 

You can specify custom DNS servers for name resolution within the Vnet. If you do not specify a DNS server, Azure DNS will be used by default. 

For more information about designing your VNet, set [plan and design Azure Virtual Networks][plan-and-design-vnet].

## Peering

There are several ways to connect VNets together:

1. Peering
2. VPN Gateway
3. ExpressRoute Gateway

## Security Considerations

By default, all inbound and outbound traffic within a VNet is allowed. We recommend you use network security groups to specify security rules to only allow expected network traffic within the VNet.

## Tutorials: deploying resources using Azure Building Blocks

The objective of the following set of tutorials is to teach you how to develop Azure Building Block parameter files that deploy complex architectures. The Azure Building Blocks project is a command line tool and set of standard Azure Resource Manager templates designed to simply resource deployment. Resources are specified using a single or multiple parameter files authored in JSON. The command line tool merges best practices defaults with the specified parameters and deploys the resources to Azure.

These tutorials are progressive, beginning with a tutorial showing how to deploy a simple virtual network, then adding multiple virtual networks, multiple virtual machines, and load balancers. These tutorials will also demonstrate how to implement security features such as a virtual network protected by a network security group, and a virtual machine running as a jumpbox. By the end of these tutorials you will have learned how to author the parameter files to deploy a secure architecture capable of hosting a multi-tier application. 

### Before you start

All the tutorials in this document are deployed using the [Azure Building Blocks][azbb]. Before you start this tutorial, we suggest you first read the [Azure Building Blocks overview][azbb-overview] on the wiki. Next, [install][azbb-install] the Azure Building Blocks and become familiar with the [structure][azbb-parameter-file] of an Azure Building Blocks parameter file.

The Azure Building Blocks require an active Azure subscription with permission to deploy . You will also require an editor to open and view JSON files.

Finally, [clone][github-how-to-clone] the [Azure Building Blocks][azbb] Github repository. The repository includes a folder named `scenarios` that contains a number of example Azure Building Blocks parameter files. We'll use these files for the following tutorials.

## Tutorial 1: deploy a simple VNet

This tutorial will walk you through an example [Azure Building Blocks][azure-building-blocks] parameter file and explain how to specify the necessary settings for a simple VNet. You will then learn how to use the Azure Building Blocks command line tool to deploy the resources specified in the parameter file. To learn how to deploy a virtual network using other methods, we recommend you read the [create a virtual network][create-a-vnet] document.

### Before You Start

If you haven't done so, [clone][github-how-to-clone] the [Azure Building Blocks Github repository][azbb]. Navigate to the `/scenarios` folder, then to the `/vnet` folder, and open the `vnet-simple.json` file in an editor such as [Visual Studio Code][vs-code]. Next, read through the Azure Building Blocks [virtual network][azbb-vnet] parameter file schema to become familiar with the properties we'll walk through.

### Parameter file walkthrough 

Let's take a look at the JSON in the the `vnet-simple.json` parameter file:

```json
{
  "type": "VirtualNetwork",
  "settings": [
    {
      "name": "msft-hub-vnet",
      "addressPrefixes": [
        "10.0.0.0/16"
       ],
       "subnets": [
         {
           "name": "firewall",
           "addressPrefix": "10.0.1.0/24"
         }
        ]
     }
  ]
}
```
The `type` property is used by the Azure Building Blocks to identify the type of building block. We're going to deploy a VNet, so we have to specify a `VirtualNetwork` building block type. 

Every Azure Building block requires a `settings` object where we specify the properties for the building block. Let's look at each property for a simple VNet.

In Azure, each resource requires a name to uniquely identify the resource within a resource group. In Azure Building Blocks, you specify a `name` property for each resource type to provide this unique name. When we deploy this parameter file using the command line tool, this is the name that we'll see in the Azure portal user interface. In this parameter file we've named the VNet `msft-hub-vnet` because this in future tutorials this will become the central "hub" VNet for our 

Next, we specify the address space for our virtual network using the `addressPrefixes` property. The address space is specified using [CIDR notation][cidr-notation]. In our example parameter file, we've specified the address space to be `10.0.0.0/16`. This means Azure Resource Manager allocates `65536` IP addresses beginning at `10.0.0.0` and ending at `10.0.255.255` for our VNet. 

Notice that the field for specifying the virtual network address space is an array. The reason for this is because we can specify multiple address ranges. For example, in addition to `10.0.0.0/16` we could have also specified `11.0.0.0/16` to spedify everything between `11.0.0.0` and `11.0.255.255` as well:

```json
      "addressPrefixes": [
        "10.0.0.0/16",
        "11.0.0.0/16"
       ]
```

Now that we have specified the address space for our virtual network, we can begin to create named network segments known as **subnets**. Subnets are used to manage security, routing, and user access for each subnet independently of the entire VNet. Subnets are also used to segment VMs into back-end pools for load balancers and application gateways.

As you can see from our parameter file, we've specified a single subnet named `firewall` with an address space of `10.0.1.0/24`. Note that the **subnets** property is also an array - we can specify up to 1,000 subnets for each VNet.

### Deploy the VNet using Azure Building Blocks

To deploy the VNet, open a command line interface - the same command line interface you used to [install the Azure Building Blocks][azbb-install]. Navigate to the `/scenarios/vnet` folder in the Azure Building Blocks Github repository you cloned earlier. 

You'll need a few things before you can deploy the VNet using the parameter file. First, you need your Azure subscription ID. You can find your subscription ID using the Azure CLI command `az account list`, or, by going to the Azure Portal and opening the **subscriptions blade**. 

Next, you'll need to consider the resource group to which the VNet will be deployed. You can deploy to either an existing or new resource group. The Azure Building Blocks command line tool determines if the resource group name you pass with the `-g` option exists or not. If the resource group exists, the command line tool deploys the VNet to the existing resource group. If it doesn't exist, the command line tool creates the resource group for you and then deploys the VNet to the new resource group.

Finally, you'll also need to consider the Azure region where the VNet will be deployed. 

```
azbb -g <new or existing resource group> -s <subscription ID> -l <region> -p vnet-simple.json --deploy
```

The command line tool will parse the `vnet-simple.json` file and deploy it to Azure using Azure Resource Manager. To verify that the VNet was deployed, visit the [Azure Portal][azure-portal], click on `Resource Groups` in the left-hand pane to open the **Resource Groups** blade, then click on the name of the resource group you specified above. The blade for that resource group will open, and you should see the `msft-hub-vnet` in the list of resources.

## Tutorial 2:connect VNets Using Peering

While we've only set up a single VNet so far, our goal is to eventually deploy some VMs and have them communicate with one another. By default, internal communication between resources deployed to a VNet is enabled. However, if you have deployed multiple VNets and you want to enable communication between them, you must set up VNet peering. The Azure Building Block for a VNet includes properties to specify this connection.

If you've completed **tutorial 1**, you are already familiar with how to deploy a VNet with a subnet. Now we're going to build upon that template to deploy another VNet and connect them using [VNet peering][azure-vnet-peering]. For this next tutorial, we will walk through `virtualNetworkPeerings` section of the `vnet-peering.json` file in the `\scenarios\vnet\` directory of the cloned Github repository. Navigate to that file and open it in an editor such as [Visual Studio Code][vs-code].

In the `settings` section, you'll see the VNet we created in **tutorial 1**. You'll notice that we've added a section called `virtualNetworkPeerings` that we will get to shortly:

```json
"virtualNetworkPeerings": [
  {
    "remoteVirtualNetwork": {
      "name": "msft-spoke1-vnet"
    },
    "allowForwardedTraffic": true,
    "allowGatewayTransit": true,
    "useRemoteGateways": false
  }
],
```

But first, let's take a look at the JSON for a second VNet named `msft-spoke1-vnet`:

```json
{
  "name": "msft-spoke1-vnet",
  "addressPrefixes": [
    "10.1.0.0/16"
  ],
  "subnets": [
    {
      "name": "web",
      "addressPrefix": "10.1.1.0/24"
    }                                
  ],
  "virtualNetworkPeerings": [
    {
      "remoteVirtualNetwork": {
        "name": "msft-hub-vnet"
      },
      "allowForwardedTraffic": true,
      "allowGatewayTransit": false,
      "useRemoteGateways": false
    }
  ],
  "tags": {
    "department": "HR",
    "managedBy": "DevOps"
  }                            
}
```

We've given it an address space of `10.1.0.0/16`, which is different from the address space of `msft-hub-vnet`. This is because the address space for peered VNets **must not overlap**. If the address spaces were to overlap, it's possible that the same IP address could be allocated in each of the two VNets, causing an IP conflict.

The `virtualNetworkPeerings` section is where the actual connection is specified. For `msft-hub-vnet`, the `remoteVirtualNetwork` property is set to `msft-spoke1-vnet`. This is all that's necessary to specify the peering connection between the two VNets and network traffic can flow from `msft-hub-vnet` to `msft-spoke1-vnet`. We'd also like traffic to flow from `msft-spoke1-vnet` to `msft-hub-vnet`, so we'll set the `remoteVirtualNetwork` property to `msft-hub-vnet` for `msft-spoke1-vnet`.

There's a few more settings in the `virtualNetworkPeerings` section that specify how traffic transit between the two VNets is handled. These settings are typically used to enforce part of your VNet's security rules. The settings are:
* `allowForwardedTraffic` is set to `true` to allow network traffic that did not originate in the VNet to be forwarded to the peered VNet.
* `allowGatewayTransit` is set to `false` to prevent network traffic from a Gateway subnet attached to this subnet from being forwarded to the peered VNet. 
* `useRemoteGateways` is set to `false` to prevent traffic originating in a peered VNet's remote gateway from travelling to this VNet. 

### Deploy the peer VNets using Azure Building Blocks

If you completed **tutorial 1** earlier, recall that you used the Azure Building Blocks command line tool to deploy the `vnet-simple.json` parameter file from the `\scenarios\vnet` directory of the cloned `template-building-blocks` repository. 

Now, we'll do the same with the `vnet-peering.json` parameter file: 

```
azbb -g <new or existing resource group> -s <subscription ID> -l <region> -p vnet-peering.json --deploy
```

There's a special consideration to note here - the `vnet-peering.json` parameter file specifies exactly the same settings as `vnet-simple.json` and adds only new settings. If we deploy this to the same resource group as we specified for **tutorial 1**, `msft-hub-vnet` will be updated, not deployed as a new resource. This is because Azure Resource Manager sees that the existing settings are all present in the parameter file and determines this is an update operation. If we had specified any differences from the settings of the existing VNet, Azure Resource Manager would have deleted the existing VNet and deployed a new VNet. 

To verify that both of the VNets were deployed, visit the [Azure Portal][azure-portal], click on `Resource Groups` in the left-hand pane to open the **Resource Groups** blade, then click on the name of the resource group you specified above. The blade for that resource group will open, and you should see the `msft-hub-vnet` and `msft-spoke1-vnet` in the list of resources. Click on either one of the VNets to open its blade, then click on **Peerings**. You should see that `msft-hub-vnet` is peered with `msft-spoke1-vnet` and vice-versa.

<!-- links -->
[azbb]: https://github.com/mspnp/template-building-blocks
[azbb-command-line]: https://github.com/mspnp/template-building-blocks/wiki/Use-Azure-Building-Blocks-from-the-command-line
[azbb-wiki]: https://github.com/mspnp/template-building-blocks/wiki
[azbb-overview]: https://github.com/mspnp/template-building-blocks/wiki/overview
[azbb-install]: https://github.com/mspnp/template-building-blocks/wiki/Install-Azure-Building-Blocks
[azbb-parameter-file]: https://github.com/mspnp/template-building-blocks/wiki/create-a-template-building-blocks-parameter-file
[azbb-vnet]: https://github.com/mspnp/template-building-blocks/wiki/virtual-network
[azure-limits]: /azure/azure-subscription-service-limits
[azure-portal]: http://portal.azure.com
[azure-vnet-overview]: /azure/virtual-network/virtual-networks-overview
[azure-vnet-peering]: /azure/virtual-network/virtual-network-peering-overview
[cidr-notation]: https://wikipedia.org/wiki/Classless_Inter-Domain_Routing
[create-a-vnet]: /azure/virtual-network/virtual-networks-create-vnet-arm-pportal
[github-how-to-clone]: https://help.github.com/articles/cloning-a-repository/
[plan-and-design-vnet]: /azure/virtual-network/virtual-network-vnet-plan-design-arm
[vs-code]: https://code.visualstudio.com/