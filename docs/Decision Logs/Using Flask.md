# DECISION LOG 
## Decision Details 
- Date: 7th, March
- Decision Maker: All members
  
## Background 
Our project's main focus is the extraction and analysis of metadata from photographs. This process requires a reliable and flexible web framework to handle photo uploads, metadata extraction, and user interactions.
## Decision Options 

- Use Flask for the project

- Use Django for the project

- Use a serverless architecture with AWS Lambda


## Decision Rationale 
Flask is chosen for its simplicity and flexibility. It allows for quick development and is lightweight compared to Django, which, while powerful, comes with a lot of built-in functionalities that our project may not require. Node.js with Express is also a viable option but is more suited for real-time applications. A serverless architecture could be cost-efficient but might introduce complexity in handling the state and large files.

Flask's minimalistic approach gives us the freedom to add only the components we need, reducing overhead and potential performance bottlenecks. Additionally, Flask's ability to stand up a server with minimal setup is advantageous for a lean project team. Moreover, the extensive libraries available for Flask, like Flask-Uploads for handling file uploads and Pillow for image processing, make it an ideal choice for a metadata extraction and analysis project.
## Decision Outcome 
The final decision is to use Flask for the project. The key reasons include its simplicity, flexibility, and the availability of relevant libraries that would simplify the tasks of photo upload and metadata extraction. 

## Implementation Plan 

Set up a basic Flask application structure.
Implement photo upload functionality using Flask-Uploads.
Integrate the Pillow library for metadata extraction.
Create API endpoints for metadata analysis.
Design a user-friendly front end for file uploads and metadata display.
Timeline and responsibilities will be assigned to team members accordingly, with weekly check-ins to monitor progress.

## Risks and Mitigation 

Risk of the project outgrowing Flask's capabilities as it scales up. Mitigation: Ensure clean code practices and modularity, which allows for easy transitions to more robust frameworks if needed.
Potential security risks with file uploads. Mitigation: Implement rigorous file validation and secure handling practices.

## Follow-up Actions 

Conduct initial setup and configuration of the Flask environment. (Deadline: [Insert Deadline])
Research and integrate Flask extensions for file handling and image processing. (Deadline: [Insert Deadline])
Continuous testing and code reviews. (Responsibility: Development Team) 

## Conclusion 

The selection of Flask as our web framework is instrumental in meeting our project's goals of metadata extraction and analysis with efficiency and adaptability. This decision aligns with our project objectives and sets the stage for a successful implementation and future scalability.
