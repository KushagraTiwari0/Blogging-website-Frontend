import React, { useState } from "react";
import {
  useArticleCommentsQuery,
  useAuth,
} from "../hooks";
import { Link } from "react-router-dom";
import ArticleComment from "./ArticleComment";
import ArticleCommentForm from "./ArticleCommentForm";

function ArticleComments() {
  const { isAuth } = useAuth();

  const {
    isArticleCommentsLoading,
    articleComments,
    articleCommentsError,
  } = useArticleCommentsQuery();

  // Local state to allow optimistic removal after delete
  const [deletedIds, setDeletedIds] = useState([]);

  const handleDelete = (id) => {
    setDeletedIds((prev) => [...prev, id]);
  };

  if (!isAuth) {
    return (
      <p>
        <Link to="/login">Sign in</Link>{" or "}
        <Link to="/register">Sign up</Link> to add
        comment on this article
      </p>
    );
  }

  if (isArticleCommentsLoading) {
    return <p>Loading comments...</p>;
  }

  if (articleCommentsError) {
    return <p>Failed to load comments.</p>;
  }

  const visibleComments = (articleComments?.comments ?? []).filter(
    (c) => !deletedIds.includes(c.id),
  );

  return (
    <div>
      <ArticleCommentForm />

      {visibleComments.map((comment) => (
        <ArticleComment
          key={comment.id}
          comment={comment}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default ArticleComments;
