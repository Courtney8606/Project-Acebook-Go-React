# Acebook README

## Project Overview

Acebook is a social media platform designed to allow users to post, comment and like each others posts. The project aims to provide users with a platform for sharing content and engaging with others. 

### Technologies Used

- **Backend**: Go (Golang) is used to implement the backend functionality of Acebook. Go is a statically typed, compiled programming language known for its simplicity and efficiency.

- **Frontend**: JavaScript and React.js are used to develop the frontend components and user interface of Acebook. React.js is a popular JavaScript library for building user interfaces, known for its component-based architecture and reusability.

### Key Features

1. **User Authentication**: Acebook provides user authentication, allowing users to sign in to their accounts and log out when they're done. This ensures that only authorised users can access their accounts and interact with the platform. Users are also given a username which is displayed alongside posts in their feed and also on their post viewing page.

2. **Post Creation and Interaction**: Users can create posts to share their thoughts. Posts and comments have a date/time stamp are displayed in descending order, with the most recent post/comment appearing first. Users also have a user page which displays all their posts on their page. They can also like, comment on, and view the likes/comments of their own posts and posts by other users.

3. **Post Management**: Users have the ability to manage their posts by deleting them if needed. They can also unlike posts they've previously liked and delete comments they've made on posts.

4. **Profile photos**: Users can upload a profile picture up to 10 MB in size. If they chose not to upload a profile picture then they will have the default profile picture.


### Project Goals

The primary goals of the Acebook project are to:

- Create a user-friendly social media platform that promotes engagement with users.
- Deliver a responsive user interface using React.js.
- Ensure reliable backend functionality using Go, focusing on security and performance.

### Installation 

1. **Clone the Repository**: `git clone` https://github.com/PatSternberg/go-react-acebook-radon

2. **Navigate to the Directory**: Navigate the the directory where your Acebook code is located 

3. **Install dependencies for both the frontend and api applications**:
- Install Homebrew:`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
- Install Node: `brew install nvm`
- Install Go:https://go.dev/doc/install

Run the following commands:
- `cd frontend`
- `npm install`
- `cd ../api`
- `go get .`

4. **Create Database**:
- `createdb acebook`


5. **Start the Development Server**: 
Run the command `npm start`
This starts the development server for Acebook allowing you to interact with the app in your web browser 
Navigate to the back end server and run `go main.go` 
