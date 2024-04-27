import "/src/comment.css";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

const UserComment = (props) => {
  return (
    <div>
      <div className="comment" id="user-comment">
        <div className="icon-comment">
          <ProfilePicture profile={props.profile} />
        </div>
        <article
          className="feed-comment"
          id="feed-comment"
          role="commenting"
          key={props.postid}
        >
          {props.comment}
          <br></br>
        </article>
      </div>
      <p className="username">Username: {props.username}</p>
    </div>
  );
};

export default UserComment;
