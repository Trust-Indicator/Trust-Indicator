# DECISION LOG  

## Decision Details  

- Date: Aug 4th,2023 

- Decision Maker: All members 


## Background  
The setup of tooling for development, management of tasks, and project repository.  
1. Increasing Complexity: With the team working on web API development, it was necessary to ensure that all team members were aligned, and their efforts were coordinated. Managing tasks and synchronizing code can become complicated without the right tools. 

2. Need for Consistency in Development Environments: Web API development requires a specific set of tools and libraries. Ensuring that every team member has the same development environment was essential to prevent inconsistencies and errors. 

3. Version Control Requirements: As the team worked on different parts of the API, a system was needed to manage different versions of the code, facilitating collaboration and preventing conflicts. 

4. Time and Resource Constraints: A small team means limited resources. Efficient task management and tooling were vital to maximizing productivity without overloading team members. 

  
## Challenges: 

1. **Selection of Right Tools**: Choosing tools suitable for a small team, yet powerful enough for web API development, required careful consideration. 

2. **Avoiding Over-Complexity**: Implementing too many tools or overly complex systems could lead to confusion and wasted time, especially in a small team environment. 

3. **Cost Considerations**: With a smaller budget, the team needed to find cost-effective solutions for development, task management, and repository management. 


## Decision Options  

**Tooling for development**:  

-> *Version Control system*: Git 

-> *Development environment*: Visual Studio, Visual Studio, WebStorm 

-> *Testing tools*: Postman 

**Management of tasks**:  

-> *Project management tool*:  

- Option ONE: Jira 

- Option TWO: GitHub Projects 

-> *Workflow*: 

- Option ONE: Jira Kanban 

- Option TWO: GitHub Kanban 

 **Project repository**: 

-> *Code review*: weekly catchup meetings for code review before they are merged into the main branch. 

-> *Rules for code quality*: readable, maintainable, efficient, and free of errors.  


## Decision Rationale  

**Option Chosen: GitHub Projects**

Reasons for Decision: 

1. Integration with Existing Tools: Since the version control system being used is Git, and GitHub is likely hosting the repository, using GitHub Projects ensures seamless integration with the existing codebase. 

2. Simplicity: GitHub Projects offers a straightforward interface and is easy to set up, especially for those already familiar with GitHub. This can lead to quicker adoption by the team. 

3. Cost: Depending on the subscription plan, GitHub Projects might offer a more cost-effective project management solution than other options like Jira. 

4. Collaboration: GitHub's tight integration between code, issues, and project boards may offer more efficient collaboration within the team. 

***Alternative Option: Jira***

Pros: Highly customizable, robust features, integration with various other development tools. 

Cons: Potentially higher cost, steeper learning curve, more complexity than needed. 

**Option Chosen: GitHub Kanban**

Reasons for Decision: 

1. Alignment with Project Management Tool: Since GitHub Projects was chosen for task management, using a workflow that integrates tightly with this tool makes sense. The GitHub Kanban is naturally aligned with GitHub Projects. 

2. Ease of Implementation: With existing integration and support in the platform, implementing a Kanban within GitHub is often a matter of configuration without managing separate systems or tools. 

3. Visibility and Transparency: Using the GitHub Kanban, all team members can easily view the progress of tasks and understand where everything stands in the development cycle. 

4. Agility: The Kanban methodology supports an agile way of working, allowing for flexibility in task management and promoting continuous delivery. 

***Alternative Option: Jira Kanban***

Pros: Greater customization, extended features, well-suited for larger or more complex projects. 

Cons: It might require more time and effort to integrate with GitHub, potential cost considerations, and may include more features than necessary for the given project. 

## Decision Outcome and Conclusion 

The decision to use GitHub Projects to manage tasks and the GitHub Kanban is rooted in the desire for seamless integration, simplicity, and cost-effectiveness. This approach aligns well with the existing tools and goals of the project, providing a streamlined and cohesive solution without unnecessary complexity. The selected options take advantage of the team's familiarity with GitHub and focus on enhancing collaboration and agility in the development process. 

 ## Brief Decision Making Log

 ![show](https://github.com/tonypioneer/Trust-Indicator/blob/97dcdcefb9d555261442ff8e46e50afd88dcb9f0/docs/Decision%20Logs/DecisionMakingLog.png)
