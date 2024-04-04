import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPostsByUserID } from "../../services/posts";
import Post from "../../components/Post/Post";
import LikeButton from "../../components/LikeButton/LikeButton";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import CommentsBox from "../../components/CommentsBox/CommentsBox";
import { getLikes, likeCreate, unlikeCreate } from "../../services/likes";
import ProfileBox from "../../components/Profile/Profile";
import "/src/FeedPage.css";
import "../../components/Profile/Profile.css";

export const MyPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState([]);
  const [emptyPosts, setEmptyPosts] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // New addition - set Comments
  // const [comments, setComments] = useState([]);

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userID = localStorage.getItem('userID');
        // Fetch posts
        const { posts: postsData } = await getPostsByUserID(userID, token);
        setPosts(postsData);
        console.log(postsData)
        console.log(length.postsData)
        if (postsData.length != 0) {
          setEmptyPosts(false)
        }

        // Fetch likes for each post
        const likesData = {};
        const likedData = {};
        for (const post of postsData) {
          const likeData = await getLikes(post._id, token);
          likesData[post._id] = likeData.LikeCount;
          likedData[post._id] = likeData.UserHasLiked;
        }

        setLikes(likesData);
        setLiked(likedData);
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
        <ProfileBox />
      </div>
      <h1>My posts</h1>
      <div className="feed" role="feed">
        {posts.filter(post => !post.deletedAt).map((post) => (
          <div className="post-object" key={post._id}>
            <div className="post-css">
              <Post post={post} />
            </div>
            <div className="like-css">
              <LikeButton
                postid={post._id}
                liked={liked[post._id]}
                likes={likes[post._id]}
                onToggleLike={() => toggleLike(post._id)}
              />
            </div>
            <DeleteButton key={`delete-${post._id}`} postID={post._id} />
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
      {emptyPosts && <p className="empty-posts">You have no posts to display</p>}
    </>
  );
};



// import { Link } from "react-router-dom";

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getPostsByUserEmail } from "../../services/posts";
// import Post from "../../components/Post/Post";
// import LikeButton from "../../components/LikeButton/LikeButton";
// import CommentsBox from "../../components/CommentsBox/CommentsBox";
// import "../src/FeedPage.css";

// export const MyPostsPage = () => {
//   const [posts, setPosts] = useState([]);

//   // New addition - set Comments
//   // const [comments, setComments] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userEmail = localStorage.getItem("userEmail");
//     if (token) {
//       const postData = getPostsByUserEmail(userEmail, token)
//         // const commentData = getComments(token)
//         .then((postData) => {
//           setPosts(postData.posts);
//           localStorage.setItem("token", postData.token);
//           // .then((commentData) => {
//           //   setComments(commentData.comments);
//           //   localStorage.setItem("token", data.token);
//           // });
//         })
//         .catch((err) => {
//           console.error(err);
//           navigate("/login");
//         })
//         .finally(() => {
//           setLoading(false); // Update loading state after data fetch
//         });
//     }
//   }, [navigate]);

//   if (loading) {
//     return <div>Loading...</div>; // Render loading indicator
//   }

//   const token = localStorage.getItem("token");
//   if (!token) {
//     navigate("/login");
//     return;
//   }

//   const toggleLike = (post_id) => {
//     posts.map((post) =>
//       post._id === post_id ? { ...post, liked: !post.liked } : post
//     );
//     setPosts(updatedPosts);
//   };

//   return (
//     <>
//       <h1>My Posts</h1>
//       <div className="feed" role="feed">
//         {posts.map((post) => (
//           <div className="post-object">
//             <div className="post-css">
//               <Post post={post} key={post._id} />
//             </div>
//             <div className="like-css">
//               <LikeButton
//                 key={`like-${post._id}`}
//                 // liked={props.post.liked}
//                 // onToggleLike={() => toggleLike(props.post._id)}
//               />
//             </div>
//             <div className="commentsbox-css">
//               {/* Attempting to insert comments input box, and display comments associated with a Post ID */}
//               <CommentsBox key={`comment-${post._id}`} />
//               {/* {comments
//               .filter((comment) => comment.post_id === post._id)
//               .map((filteredComment) => (
//                 <Comment
//                   comment={filteredComment}
//                   key={filteredComment.comment._id}
//                 />
//               ))} */}
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };