import "/src/Post.css";
import ProfileBox from "../../components/Profile/Profile";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

const Post = (props) => {
  const { profile } = props;
  return (
    <div className="post">
      <ProfilePicture profile={profile} />
      <div className="message-box">
        <div className="userinfo">
          <p className="postDate">On {props.post.created_at}</p>
          <p>
            <em>
              <strong>{props.post.username}</strong>
            </em>{" "}
            said:
          </p>
        </div>
        <article role="posting" className="feed-message" key={props.post._id}>
          {props.post.message}
        </article>
      </div>
    </div>
  );
};

export default Post;
