import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { CreatePostPage } from "./pages/CreatePost/CreatePostPage";
import { MyPostsPage } from './pages/MyPostsPage/MyPostsPage';
import NavigationBar from './components/NavigationBar/NavigationBar'

// All components of the App are wrapped in a BrowserRouter component
// which enables each component to access routes stored in it

const App = () => {
  return (
    <BrowserRouter>
      <NavigationBar/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/posts" element={<FeedPage/>} />
        <Route path="/createpost" element={<CreatePostPage/>} />
        <Route path='/myposts' element={<MyPostsPage/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
