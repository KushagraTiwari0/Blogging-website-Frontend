import React from "react";
import { useAuth } from "../hooks";
import { Link } from "react-router-dom";

function ArticleComment({ comment, onDelete }) {
  const { author, body, createdAt, id } = comment;
  const { authUser } = useAuth();

  // Check if the current user is the comment's author
  const canDelete =
    author?.username === authUser?.username;

  // Handle Delete Request
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `/api/articles/${comment.articleSlug}/comments/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUser.token}`, // Include token in Authorization header
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete comment",
        );
      }

      // Call onDelete to update UI after successful deletion
      onDelete(id);
    } catch (error) {
      console.error(
        "Error deleting comment:",
        error,
      );
    }
  };

  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{body}</p>
      </div>

      {id && (
        <div className="card-footer">
          <Link>{author.username}</Link>&nbsp;
          <span className="date-posted">
            {new Date(createdAt).toDateString()}
          </span>
          &nbsp;
          {canDelete && (
            <button onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ArticleComment;
