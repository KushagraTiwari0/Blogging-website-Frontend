import React, {
  useEffect,
  useState,
} from "react";
import ArticleComment from "./ArticleComment";

function ArticleCommentsList({ slug }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch comments when the component mounts
    const fetchComments = async () => {
      const response = await fetch(
        `/api/articles/${slug}/comments`,
      );
      const data = await response.json();
      setComments(data.comments);
    };

    fetchComments();
  }, [slug]);

  // Handler to remove comment from state after deletion
  const handleDeleteComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter(
        (comment) => comment.id !== commentId,
      ),
    );
  };

  return (
    <div>
      {comments.map((comment) => (
        <ArticleComment
          key={comment.id}
          comment={comment}
          onDelete={handleDeleteComment} // Pass delete handler
        />
      ))}
    </div>
  );
}

export default ArticleCommentsList;
