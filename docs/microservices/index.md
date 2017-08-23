# Build and run a microservices architecture on Azure

Microservices have become a popular architectural style for building cloud applications that are resilient, highly scalable, and able to evolve quickly. To be more than just a buzzword, however, microservices requires a different approach to designing and building applications. 

In this set of articles, we explore how to build and run a microservices architecture on Azure. Topics include:

- Using Domain Driven Design (DDD) to design a microservices architecture. 
- Choosing the right Azure technologies for compute, storage, messaging, and other elements of the design.
- Understanding microservices design patterns.
- Analyzing and optimizing performance.
- Building a CI/CD pipeline.

Throughout, we focus on an end-to-end scenario: A drone delivery service that lets customers schedule packages to be picked up and delivered via drone. 

But first, let's start with fundamentals. What are microservices, and what are the advantages of adopting a microservices architecture?

## In the beginning was the monolith

A *monolith* is an application with a unified code base and a single release pipeline. At the start of a project, this is a very natural way to build an application. As an application grows, however, and more features are added, a monolithic design starts to cause problems. This is especially true if the number of developers working on the code grows past a certain size. 

- A bug found in one part of the code can block the entire release process. New features may be held up waiting for a bug fix to be integrated, tested, and published. 
- A large code base is hard to understand. A team working on one feature may end up touching code that another team depends on. (Have you ever felt that you spend more time resolving merge conflicts than writing new features?)
- Managing dependencies can become a nightmare. Dependencies might be caused by shared data schemas, leaky abstractions, library or framework versions, or failure to enforce boundaries between modules or layers in the application. 
- Failures in one subsystem can take down the entire application. It can be hard to incorporate resiliency features such as circuit breakers or queue-based load leveling into a monolith.
- Horizontal scaling can be hard to achieve in a monolith. Generally, you scale out a monolith by deploying multiple instances of the application. Unfortunately, this is a very coarse-grained approach. At cloud scale, you would like the ability to scale out the parts of the application that are especially resource intensive, without scaling out the entire application.

> [!NOTE]
> Despite these concerns, a monolith may not be a bad place to start. If a monolithic application is designed well, it should be possible to refactor it into services at a later time. In his book *Building Microservices* (O'Reilly Media, 2015), Sam Newman writes: "When starting out, however, keep a new system on the more monolithic side; getting service boundaries wrong can be costly, so waiting for things to stabilize as you get to grips with a new domain is sensible."
	
## Enter microservices

In a microservices architecture, the application is composed of small, independent services. Here are some of the defining characteristics of microservices:

- Each service implements a single business capability.
- Services run in separate processes, communicating through well-defined APIs or messaging patterns.
- Services do not share data stores or data schemas. Each service is responsible for managing its own data. 
- Services have separate code bases, and do not share source code. They may use common utility libraries, however.
- Services are small. A small team of developers, typically 5 &ndash; 10 people, can write and maintain a service.
- Services are deployed independently. 

Done correctly, microservices can provide a number of useful benefits:

- Because services are deployed independently, bug fixes and feature releases are more manageable and less risky. You can update a service without redeploying the entire application, and roll back an update if something goes wrong. 
- A single development team can build, test, and deploy a service. By not sharing code or data stores, dependencies between services are minimized. That makes it easier to add new features. 
- Teams can pick the technology that best fits their service, using a mix of technology stacks as appropriate. 
- If a service goes down, it won't take out the entire application. 
- Services can be scaled independently. At the same time, by running services in containers, it's possible to pack a higher density of services onto a single VM. 

These benefits don't come for free. Some of the challenges when adopting a microservices architecture include:

- Design. What are the service boundaries? How big should a service be? How will services communicate?
- Team structure. Can you successfully organize into small, semi-independent teams? Do you have a strong DevOps culture? 
- CI/CD. You must have automated and robust CI/CD, so that you can reliably deploy the application into test and production environments.
- Testing. The decentralized nature of building microservices requires new approaches to testing. During development, you will test an individual service against stubs or API contracts. Then perform integration testing in a production-like test environment (test cluster). Performance tests and load tests are also critical.
- Monitoring and telemetry. A single client request may invoke multiple services. That makes it harder to get a holistic view of the system and understand the sources of bottlenecks and performance issues.

Next: [Apply Domain Driven Design](./domain-analysis.md)

