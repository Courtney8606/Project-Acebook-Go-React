import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts } from "../../services/posts";
import Post from "../../components/Post/Post";
import LikeButton from "../../components/LikeButton/LikeButton";
import SignoutButton from "../../components/SignoutButton/SignoutButton";
import "/src/FeedPage.css";

export const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getPosts(token)
        .then((data) => {
          setPosts(data.posts);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        })
        .finally(() => {
          setLoading(false); // Update loading state after data fetch
        });
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator
  }

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  const toggleLike = (post_id) => {
    posts.map((post) =>
      post._id === post_id ? { ...post, liked: !post.liked } : post
    );
    setGigs(updatedGigs);
  };

  return (
    <>
      <h1>Posts</h1>
      <div className="feed" role="feed">
        {posts.map((post) => (
          <div className="post-object">
            <Post post={post} key={post._id} />
            <LikeButton
              key={`like-${post._id}`}
              // liked={props.post.liked}
              // onToggleLike={() => toggleLike(props.post._id)}
            />
          </div>
        ))}
      </div>

      <br></br>

      <div className="signoutButton" role="button">
        <SignoutButton />
      </div>
    </>
  );
};
