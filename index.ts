import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import { getListenerOutput, getLoadBalancerOutput } from "@pulumi/aws/alb";

// Create a load balancer to listen for requests and route them to the container.
const listener = new awsx.elasticloadbalancingv2.NetworkListener("nginx", { 
    port: 8080,
});
const listener_443 = new awsx.elasticloadbalancingv2.NetworkListener("nginx", { 
    port: 443,
});

// const alb = getLoadBalancerOutput({
//     arn: 'arn:aws:elasticloadbalancing:us-east-1:303658717825:loadbalancer/app/cust-api-alb/ff89ddfab088b4c0'
// }
// );

// const listener_443 = getListenerOutput({
//     arn: 'arn:aws:elasticloadbalancing:us-east-1:303658717825:listener/app/cust-api-alb/ff89ddfab088b4c0/85a78e728689e7ed',
//     loadBalancerArn: alb.arn
// });
// const listener_80 = getListenerOutput({
//     arn: 'arn:aws:elasticloadbalancing:us-east-1:303658717825:listener/app/cust-api-alb/ff89ddfab088b4c0/c549cf4d3347f66c',
//     loadBalancerArn: alb.arn
// });

// Export the URL so we can easily access it.
export const frontendURL = pulumi.interpolate `http://${listener.endpoint.hostname}/`;

// Define the service, building and publishing our "./app/Dockerfile", and using the load balancer.
const service1 = new awsx.ecs.FargateService("snap", {
    desiredCount: 1,
    taskDefinitionArgs: {
        containers: {
            snap: {
                // image: awsx.ecs.Image.fromPath("nginx", "./app"),
                image: 'mrhoden/snap:latest',
                memory: 512,
                portMappings: [listener],
            },
        },
    },
});

const nlbUrl= `http://${listener.endpoint.hostname}/`
// const service2 = new awsx.ecs.FargateService("siege", {
//     desiredCount: 0,
//     taskDefinitionArgs: {
//         containers: {
//             siege: {
//                 // image: awsx.ecs.Image.fromPath("nginx", "./app"),
//                 image: 'bmccraw86/docker-siege:latest',
//                 memory: 512,
//                 command: ['-d1', '-r10', '-c25', nlbUrl]
//             },
//         },
//     },
// });


