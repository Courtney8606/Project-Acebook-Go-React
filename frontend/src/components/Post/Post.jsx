import "/src/Post.css";

const Post = (props) => {
  return (
    <div className="post">
      <div className="icon-posts">
        <i className="fas fa-user-circle"></i>
      </div>
      <article role='posting' className="feed-message" key={props.post._id}>
        {props.post.message}
      </article>
    </div>
  );
};

export default Post;
