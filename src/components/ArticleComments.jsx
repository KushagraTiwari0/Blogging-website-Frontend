import React, { useState } from "react";
import "./SkeletonCard.css";
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
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[1, 2].map((i) => (
          <div key={i} className="card" style={{ padding: "20px", pointerEvents: "none" }}>
            <div className="card-block">
              <div className="skeleton" style={{ height: "14px", width: "90%", marginBottom: "8px" }}></div>
              <div className="skeleton" style={{ height: "14px", width: "60%" }}></div>
            </div>
            <div className="card-footer" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div className="skeleton" style={{ width: "20px", height: "20px", borderRadius: "50%" }}></div>
              <div className="skeleton" style={{ width: "80px", height: "12px" }}></div>
              <div className="skeleton" style={{ width: "100px", height: "12px" }}></div>
            </div>
          </div>
        ))}
      </div>
    );
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
