# Acebook

Acebook is a social media platform designed to allow users to post, comment and like each others posts. The project aims to provide users with a platform for sharing content and engaging with others. 

This was a unique opportunity at this stage of learning to collaborate within a multi-language team, using Javascript and React.js on the frontend and Go on the backend. This provided a new challenge learning to integrate completely disparate front and back end technologies. It also allowed me a concentrated learning experience on the frontend, delving more deeply into UI development.  

### Technologies Used

- **Frontend**: JavaScript and React.js are used to develop the frontend components and user interface of Acebook. React.js is a popular JavaScript library for building user interfaces, known for its component-based architecture and reusability.

- **Backend**: Go (Golang) is used to implement the backend functionality of Acebook. Go is a statically typed, compiled programming language known for its simplicity and efficiency.

### Key Features

1. **User Authentication**: Acebook provides user authentication, allowing users to sign in to their accounts and log out when they're done. This ensures that only authorised users can access their accounts and interact with the platform. Users are also given a username which is displayed alongside posts in their feed and also on their post viewing page.

2. **Post Creation and Interaction**: Users can create posts to share their thoughts. Posts and comments have a date/time stamp are displayed in descending order, with the most recent post/comment appearing first. Users also have a user account page which displays only their posts. They can also like, comment on, and view the likes/comments of their own posts and posts by other users.

3. **Post Management**: Users have the ability to manage their posts by deleting them if needed. They can also unlike posts they've previously liked and delete comments they've made on posts.

4. **Profile Pictures**: Users can upload a profile picture up to 10 MB in size. If they chose not to upload a profile picture then they will have a default profile picture.


### Project Goals

The primary goals of the Acebook project are to:

- Create a user-friendly social media platform that promotes engagement with users.
- Deliver a responsive user interface using React.js.
- Ensure reliable backend functionality using Go, focusing on security and performance.

### Installation 

1. **Clone the Repository**

2. **Navigate to the Directory**: Navigate to the directory where your Acebook code is located 

3. **Install dependencies for both the frontend and backend applications**

These instructions are for macOS, and it is assumed that that the following are already installed:

* NVM
* Node.js
* Homebrew
* Go (Install Go:https://go.dev/doc/install)

Run the following commands:
- `cd frontend`
- `npm install`
- `cd ../api`
- `go get .`
- `brew services start postgresql`

* Create a file api/.env with contents confirmed directly with myself. 
* Create a file frontend/.env with the following contents: VITE_BACKEND_URL="http://localhost:8082"

4. **Create Database**:
- `createdb acebook`

5. **Start the Development Server**: 
Within the api folder, run `go run main.go` to start the backend server, click Allow to accept incoming network connections.  
Within the frontend folder, run the command `npm run dev` to begin the frontend server, and navigate to http://localhost:5173/
