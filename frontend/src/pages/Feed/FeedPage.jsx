import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../../services/posts";
// import { getComments } from "../../services/comments";
import Post from "../../components/Post/Post";
import LikeButton from "../../components/LikeButton/LikeButton";
import CommentsBox from "../../components/CommentsBox/CommentsBox";
// import SignoutButton from "../../components/SignoutButton/SignoutButton";
import "/src/FeedPage.css";


export const FeedPage = () => {
  const [posts, setPosts] = useState([]);

  // New addition - set Comments
  // const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const postData = getPosts(token)
        // const commentData = getComments(token)
        .then((postData) => {
          setPosts(postData.posts);
          localStorage.setItem("token", postData.token);
          // .then((commentData) => {
          //   setComments(commentData.comments);
          //   localStorage.setItem("token", data.token);
          // });
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
    setPosts(updatedPosts);
  };

  return (
    <>
      <h1>Posts</h1>
      <div className="feed" role="feed">
        {posts.map((post) => (
          <div className="post-object">
            <div className="post-css">
              <Post post={post} key={post._id} />
            </div>
            <div className="like-css">
              <LikeButton
                key={`like-${post._id}`}
                // liked={props.post.liked}
                // onToggleLike={() => toggleLike(props.post._id)}
              />
            </div>
            <div className="commentsbox-css">
              {/* Attempting to insert comments input box, and display comments associated with a Post ID */}
              <CommentsBox key={`comment-${post._id}`} />
              {/* {comments
              .filter((comment) => comment.post_id === post._id)
              .map((filteredComment) => (
                <Comment
                  comment={filteredComment}
                  key={filteredComment.comment._id}
                />
              ))} */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
