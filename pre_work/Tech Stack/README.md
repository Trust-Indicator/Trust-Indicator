# Overall Design Idea
![overall design](https://github.com/YifangMeng/Trust-Indicator/assets/141119645/20de9545-37c9-4b7a-adc4-67899f3e2b06)

At the beginning of the project, we first considered the server construction, we adopted
a web server and matched two different environments respectively in the front end and
back end. The front-end collocation environment is Linux + Nginx + PHP 7.4, and the
back-end uses a Linux+Docker environment configuration. In the choice of hardware, we
used an old computer to install the Linux system, installed PHP and Nginx in the
computer to carry the front end, and finally installed Docker to allow the back end to run
normally. If we utilize an already created server, we may not need to bother about the server architecture; we only need to alter the server configuration.

# Basic Structure
To achieve reliability and ease of debugging, we split our project architecture into two
separate parts by separating the client-side and server-side

![basic structure](https://github.com/YifangMeng/Trust-Indicator/assets/141119645/bd4d63ac-b25e-42ec-822b-55052eea97fc)

In terms of developers, the separation of client-side and server-side could allow people
who implement client-side using HTML, CSS, and JavaScript or react to focus solely on UI,
control logic, rendering logic, and high-performance human-computer interaction to
improve user experience. In contrast, server-side developers are responsible for
designing and implementing the interface that allows servers, functions, and databases
to interact. Furthermore, dividing the architecture of a project into two parts could
promote communication among team members, and each team member could play an
an essential role in their expertise area.
![server side](https://github.com/YifangMeng/Trust-Indicator/assets/141119645/d3c61046-e521-4192-b00d-683047b7d5e2)

|  Web with Server-side  |      Web without Server-side     |    
|:---------|:------------:|
|(1) Improve development efficiency; only need to keep the interface (API) consistent, and developers could develop simultaneously, without waiting for either group to finish work. |(1) The runtime of JavaScript within the client side is faster as it is unencumbered by network calls to a back-end server and frequent server requests.|                 
|(2) The Web is not allowed to access the database directly. Still, it will enable the Web to access or operate the database through the corresponding API to ensure the security of user data.|(2) No additional servers are required to run the Server-Side and may not cause financial pressure on web developers.|                    
|(3) The server side helps efficiently load webpages for users, improving the user experience. |(3) Avoid the server side may not be compatible with third-party JavaScript code|       

Aslo, after our team members carefully compared the advantages of establishing server
side and not having server-side, creating a stable, fast, and standalone web version would be a primary purpose of our team, thereby we are
concerned that ability to load web pages quickly. Oppositely, we may not be interested in debugging the web pages that crashed due to frequent server requests as the utilization
of our server in this project is limited to the establishment and update of the database
and the realization of some functions.
We believe it is a correct long-term decision to divide the architecture of the entire
project into the client-side and server-side. It is beneficial for each team member to
actively participate in project development and enjoy the process of completing project
development through teamwork.

# Tools and Technologies
|  Tech Chosen  |      Description     |    
|:---------|:------------:|
|Asp.net and entity framework|Our backend development will be done in ASP.NET, and we'll employ entity framework to build and map the database using code first approach. Using Entity Framework will save us development time as we are all familiar with it|                 
|Html, JavaScript, and CSS|HTML provides the foundation for a website's structure, which is then expanded and modified using CSS and JavaScript. Presentation, formatting, and layout are all controlled by CSS. JavaScript is used to control how certain elements behave. They are the three core programming languages that make up the World Wide Web.|                    
|Linux server |Linux servers are commonly used nowadays and are among the most popular due to their reliability, security, and flexibility and asp.net works on Linux servers as well.|      
|Vanilla Js |Vanilla Js is the most lightweight JavaScript framework available, as well as the fastest of all the other JavaScript frameworks.| 
|Bootstrap |Bootstrap is the most widely used CSS Framework for building responsive and mobile-first websites. The Bootstrap libraries provide ready-made code that can save us a lot of time for UI.| 
|React |React is a JavaScript library for building user interfaces with a component-based approach and a virtual DOM. It emphasizes declarative syntax, making UI development more efficient and maintainable. Its ecosystem includes various tools and libraries, making it a popular choice for building dynamic web applications.|
|MySQL |MySQL is an open-source relational database management system widely used for storing and managing structured data. It supports SQL for querying and manipulating data. While MySQL is not specifically designed for storing large binary data like photos, it can handle photo storage by storing image file paths or binary data (BLOBs) directly in the database. However, for more efficient photo storage and retrieval, it is recommended to use dedicated file storage solutions or cloud-based storage services, and store file paths or links in the MySQL database for easy reference and retrieval.|

# Communication between frontend and backend
We have set up APIs in Javascript for each function to communicate with the backend.
Our front end sends requests through API to the back end based on user actions, such
as registration, login, and so on. The backend processes the request according to the
controller's code, and for some requests designed for user privacy or score, the user's
identity needs to be verified. 

![comunication](https://github.com/YifangMeng/Trust-Indicator/assets/141119645/2c6f2518-5f13-4b15-b8c0-391011bd944c)

# Declaration
During our technology selection process, we engaged in extensive research and discussions, taking into account the maturity of the technology, community support, and how they align with our project needs. The technology domain is continuously evolving. As the project progresses, there might be scenarios or requirements that prompt us to consider introducing new technologies or languages. I want to emphasize that such considerations are not based on a preference for certain technologies but on how best to meet project requirements and deliver greater benefits. Whenever we think of changing or introducing technology, we ensure it benefits the project. For instance, in terms of challenges encountered with ML and neural networks, we may consider using Python as a secondary language. Python is among the most popular programming languages in the machine learning domain. It features a clear, readable, and easy-to-learn syntax, ideal for rapid prototyping and experimentation. Python boasts a wealth of third-party libraries and tools, such as NumPy, Pandas, Matplotlib, and scikit-learn, tailored for data processing, numerical computations, and machine learning model building. Framework usage: scikit-learn is a simple yet powerful Python machine learning library suitable for a range of machine learning algorithms and tasks. TensorFlow and PyTorch are professional deep learning frameworks used to design and train neural networks. Our primary goal is to ensure that technology serves the business, rather than the business adapting to the technology. Please trust that every technical decision we make aims at ensuring the project's success.







     
