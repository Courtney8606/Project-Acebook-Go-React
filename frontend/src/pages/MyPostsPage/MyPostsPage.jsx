import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPostsByUserID } from "../../services/posts";
import Post from "../../components/Post/Post";
import LikeButton from "../../components/LikeButton/LikeButton";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import { getComments, commentCreate } from "../../services/comments";
import UserComment from "../../components/Comment/Comment";
import CommentsBox from "../../components/CommentsBox/CommentsBox";
import { getLikes, likeCreate, unlikeCreate } from "../../services/likes";
import ProfileBox from "../../components/Profile/Profile";
import { getImage } from "../../services/images";
import "/src/FeedPage.css";
import "../../components/Profile/Profile.css";

export const MyPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState([]);
  const [comments, setComments] = useState([]);
  const [emptyPosts, setEmptyPosts] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [profile, setProfile] = useState([]);

  const handlePostDeletion = (postID) => {
    setPosts(posts.filter((post) => post._id !== postID));
  };

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userID = localStorage.getItem("userID");
        // Fetch posts
        const { posts: postsData } = await getPostsByUserID(userID, token);
        setPosts(postsData);
        if (postsData.length != 0) {
          setEmptyPosts(false);
        }

        // Fetch likes for each post
        const likesData = {};
        const likedData = {};
        const commentsData = {};
        for (const post of postsData) {
          const likeData = await getLikes(post._id, token);
          const commentData = await getComments(post._id, token);
          likesData[post._id] = likeData.LikeCount;
          likedData[post._id] = likeData.UserHasLiked;
          commentsData[post._id] = commentData.comments;
        }

        setLikes(likesData);
        setLiked(likedData);
        setComments(commentsData);
        const profilepicture = await getImage(userID, token);
        setProfile(profilepicture);
        console.log(profilepicture);
      } catch (error) {
        console.error(error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator
  }

  const handleProfilePictureUpdate = (newProfilePicture) => {
    setProfile(newProfilePicture);
  };

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
      <div className="profile-container">
        <ProfileBox profile={profile} setProfile={handleProfilePictureUpdate} />
      </div>
      <h1>My posts</h1>
      <div className="feed" role="feed">
        {posts.map((post) => (
          <div className="post-object" key={post._id}>
            <div className="post-css">
              <Post post={post} profile={profile} />
            </div>
            <div className="like-delete-buttons">
              <DeleteButton
                key={`delete-${post._id}`}
                postID={post._id}
                // Functionality to rerender the component when it is deleted
                onDelete={handlePostDeletion}
              />
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
            <div>
              {comments[post._id] &&
                comments[post._id].map((comment) => (
                  <UserComment
                    key={comment.comment_id}
                    postid={post._id}
                    comment={comment.text}
                    username={comment.username}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
      {emptyPosts && (
        <p className="empty-posts">You have no posts to display</p>
      )}
    </>
  );
};

export default MyPostsPage;
