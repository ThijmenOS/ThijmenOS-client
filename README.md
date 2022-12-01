# thijmen-os client

The Client module is the main entry point of the client side of the thijmen-os project. This project contains the index.html that loads everything on the DOM. It also contains the most important things such as the kernel or the app manager

## Module structure

The typescript code is contained in the src folder. In this folder are two more folders.

- Core
- Types

Core contains the typescript classes the perform the logic to make the OS work, and types obviously contains the type definitions that are used within this module.

## Module explanation

Everything starts with the index.ts file thats is being called from the index.html file. This file calls the startup class which initiates the nesecerry processes like settings gathering, kernel operations and it fetches desktop files to show.
Then the desktop files will be rendered and when you click an icon the app manager is consulted. Based on the fil e type the file will be executed or a default application will be searched for the filetype. If it can't find that either it goes ahead and asks the user with which application the file should be openend.

Then when it is time to open the actual application the window module is called with the request to build a window for the application (for more details on application windows see the @thijmen-os/window repository).
The last component in this module is the kernel. This is the communication between applications and the operating system. When an application wants to do something, for example read files or talk to other applications, it asks the kernel to do so. Then the kernel will handle everything and callback the application with the correct infomation.
![thijmen-os uml class diagram](https://github.com/ThijmenOS/.github/blob/production/profile/ThijmenOS-client.png?raw=true)
