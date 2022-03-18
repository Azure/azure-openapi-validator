# Background
Since tThere are large number of azure swagger specifications in Azure , more and more linter rule requirements are requesting from SDK, service teams. We should not 
Using spectral to introduce linter rules from source community, can accelerate the lint rule development for us.
We can benefit from open-source community and also contribute our rules to the commnunity.

## azure common scenerios
- microsoft common 

## multiple swaggger rules support
 Spectral is designed to lint swagger one by one, but in azure we should support the rule can be able to visit multiple swagger at runtime, as one resource provider migth include multiple services and each service has its own swagger. Meanwhile , there are common api among all the services as well. In most cases, each service has mulitple swagger to group their Apis.


## integrate with autorest v3

autorest provides common functinalities for SDK generation and Api Validation .
So following the formerly design,  a plugin of autorest is needed to plugin our tools to the pipeline of autorest.
In this plugin,  two tasks will be invoked:
1 spectral
2 azure linter Ts


   


## rulesets
Basically , we can have 

Linter requirement 
