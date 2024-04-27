import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../../services/posts";
import { getComments, commentCreate } from "../../services/comments";
import Post from "../../components/Post/Post";
import UserComment from "../../components/Comment/Comment";
import LikeButton from "../../components/LikeButton/LikeButton";
import CommentsBox from "../../components/CommentsBox/CommentsBox";
import { getLikes, likeCreate, unlikeCreate } from "../../services/likes";
import { getImage } from "../../services/images";
import "/src/FeedPage.css";

export const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const [profilePictures, setProfilePictures] = useState([]);

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        // Fetch posts
        const { posts: postsData } = await getPosts(token);
        setPosts(postsData);

        // Fetch likes and comments for each post
        const likesData = {};
        const likedData = {};
        const commentsData = {};
        const imagesData = {};
        for (const post of postsData) {
          console.log("Post:", post);
          const likeData = await getLikes(post._id, token);
          const commentData = await getComments(post._id, token);
          const imageData = await getImage(post.user_id, token);
          likesData[post._id] = likeData.LikeCount;
          likedData[post._id] = likeData.UserHasLiked;
          commentsData[post._id] = commentData.comments;
          imagesData[post.user_id] = imageData;
          console.log("User_id:", post.user_id);
          console.log("Token:", token);
          console.log("Image:", imageData);
        }
        console.log("Images:", imagesData);
        console.log("Comments:", commentsData);
        setProfilePictures(imagesData);
        setLikes(likesData);
        setLiked(likedData);
        setComments(commentsData);
      } catch (error) {
        console.error(error);
        navigate("/posts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator
  }

  const handleCommentCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedCommentsData = {};
      for (const post of posts) {
        const commentData = await getComments(post._id, token);
        updatedCommentsData[post._id] = commentData.comments;
      }
      setComments(updatedCommentsData);
    } catch (error) {
      console.error(error);
      navigate("/login");
    }
  };

  const toggleLike = async (post_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const isLiked = liked[post_id];
      if (isLiked) {
        await unlikeCreate(post_id, token);
        setLikes((prevLikes) => ({
          ...prevLikes,
          [post_id]: prevLikes[post_id] - 1,
        }));
      } else {
        await likeCreate(post_id, token);
        setLikes((prevLikes) => ({
          ...prevLikes,
          [post_id]: prevLikes[post_id] + 1,
        }));
      }
      setLiked((prevLiked) => ({
        ...prevLiked,
        [post_id]: !prevLiked[post_id],
      }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Posts</h1>
      <div className="feed" role="feed">
        {posts.map((post) => (
          <div className="post-object" key={post._id}>
            <div className="post-css">
              <Post post={post} profile={profilePictures[post.user_id]} />
            </div>
            <div className="like-delete-buttons">
              <LikeButton
                postid={post._id}
                liked={liked[post._id]}
                likes={likes[post._id]}
                onToggleLike={() => toggleLike(post._id)}
              />
            </div>
            <div className="commentsbox-css">
              <CommentsBox
                key={`comment-${post._id}`}
                postid={post._id}
                onCommentCreate={handleCommentCreate}
              />
            </div>
            <div className="comment-feedpage">
              {comments[post._id] &&
                comments[post._id].map((comment) => (
                  <UserComment
                    key={comment.comment_id}
                    postid={post._id}
                    comment={comment.text}
                    username={comment.username}
                    profile={profilePictures[comment.user_id]}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FeedPage;
