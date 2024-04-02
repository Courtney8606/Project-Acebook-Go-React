// testing one individual post and displaying associated
// [but for now hardcoded] comment to go with it
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../../services/posts";
import Post from "../../components/Post/Post";
import LikeButton from "../../components/LikeButton/LikeButton";
import CommentsBox from "../../components/CommentsBox/CommentsBox";
import Comment from "../../components/Comment/Comment";
import "/src/FeedPage.css";
export const FeedPage = () => {
  const [post, setPost] = useState(null); // Change to single post
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getPosts(token)
        .then((postData) => {
          const firstPost = postData.posts[0]; // Get the first post
          setPost(firstPost);
          localStorage.setItem("token", postData.token);
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
  // Hard code a test comment
  const testComment = {
    id: "1",
    post_id: "1",
    comment: "This is a test comment.",
  };
  const toggleLike = () => {
    setPost((prevPost) => ({
      ...prevPost,
      liked: !prevPost.liked,
    }));
  };
  return (
    <>
      <h1>Posts</h1>
      <div className="feed" role="feed">
        {post && ( // Render only if post exists
          <div className="post-object">
            <div className="post-css">
              <Post post={post} />
            </div>
            <div className="like-css">
              <LikeButton liked={post.liked} onToggleLike={toggleLike} />
            </div>
            <div className="commentsbox-css">
              {/* Render the test comment */}
              <CommentsBox comment={testComment} />
            </div>
            <div>
              <Comment comment="test comment" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
