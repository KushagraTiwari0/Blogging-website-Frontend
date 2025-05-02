import React from "react";
import { Link } from "react-router-dom";

function truncateText(text, wordLimit) {
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return (
      words.slice(0, wordLimit).join(" ") + "..."
    );
  }
  return text;
}

function ArticlePreview({ article }) {
  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link
          to={`/profile/${article.author.username}`}
        >
          <img
            src={article.author.image}
            alt={article.author.username}
          />
        </Link>
        <div className="info">
          <Link
            to={`/profile/${article.author.username}`}
            className="author"
          >
            {article.author.username}
          </Link>
          <span className="date">
            {new Date(
              article.createdAt,
            ).toDateString()}
          </span>
        </div>
      </div>
      <Link
        to={`/article/${article.slug}`}
        className="preview-link"
      >
        <h1>{article.title}</h1>
        <p>
          {truncateText(article.description, 50)}
        </p>
        <span>Read more...</span>
      </Link>
    </div>
  );
}

export default ArticlePreview;
