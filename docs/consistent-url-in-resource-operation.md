# ConsistentUrlInResourceOperation

## Description

The URLs should be checked for consistency. It is easy to type "resourcegroups" instead of "resourceGroups". The current rules allow that through, which causes an issue at the resource provider registration step. When that happens, the APIs get split into two sets in the swagger. The RPaaS registration is very strict and requires the same resource to have all APIs in one set. The pipeline needs to be aware of this kind of behavior and provider URL validation.

## How to fix

Ensure all URLs that belong to the same resource use the same camelCase. For example, this mismatch should not be allowed: /subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.NetworkCloud/clusters/{clusterName} /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetworkCloud/clusters/{clusterName} The first URL needs to be updated to use "resourceGroups".

## What's the impact if breaking the rule

RPaaS registration will fail if this is not corrected.
