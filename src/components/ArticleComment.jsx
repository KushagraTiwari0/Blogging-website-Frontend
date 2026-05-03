import React from "react";
import { useAuth } from "../hooks";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../constants";

function ArticleComment({ comment, onDelete }) {
  const { author, body, createdAt, id } = comment;
  const { authUser } = useAuth();

  // Check if the current user is the comment's author
  const canDelete = author?.username === authUser?.username;

  // Handle Delete Request
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/articles/${comment.articleSlug}/comments/${id}`,
      );
      // Call onDelete to update UI after successful deletion
      onDelete(id);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment.");
    }
  };

  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{body}</p>
      </div>

      {id && (
        <div className="card-footer">
          <Link to={`/profile/${author?.username}`}>{author?.username}</Link>&nbsp;
          <span className="date-posted">
            {new Date(createdAt).toDateString()}
          </span>
          &nbsp;
          {canDelete && (
            <button onClick={handleDelete} className="btn btn-sm btn-outline-danger">
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ArticleComment;
