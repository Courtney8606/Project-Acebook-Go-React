const Comment = (props) => {
  return (
    <div className="comment">
      <div className="icon-comment">
        <i className="fas fa-user-circle"></i>
      </div>
      {/* Need to determine props once backend is built - these are placeholders*/}
      <article className="feed-comment" key={props.comment.id}>
        {props.comment.comment}
      </article>
    </div>
  );
};

export default Comment;
