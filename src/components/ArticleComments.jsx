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
      <div style={{ textAlign: "center", padding: "24px 0", background: "var(--surface)", border: "1px solid var(--rule)", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
          You must be logged in to add a comment on this article.
        </p>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link to="/login" className="btn btn-sm btn-outline-primary">Sign in</Link>
          <span style={{ color: "var(--light-muted)", fontSize: "0.8rem", fontStyle: "italic" }}>or</span>
          <Link to="/register" className="btn btn-sm btn-primary">Sign up</Link>
        </div>
      </div>
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
