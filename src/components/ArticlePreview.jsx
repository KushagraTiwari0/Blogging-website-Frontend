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
            src={article.author.image && article.author.image !== "https://api.realworld.io/images/smiley-cyrus.jpeg" ? article.author.image : `https://api.dicebear.com/9.x/thumbs/svg?seed=${article.author.username}`}
            alt={article.author.username}
            loading="lazy"
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Read more...</span>
          {article.tagList && article.tagList.length > 0 && (
            <ul className="tag-list" style={{ marginBottom: 0, display: 'flex', gap: '4px', listStyle: 'none' }}>
              {article.tagList.map(tag => (
                <li key={tag} className="tag-default tag-pill tag-outline" style={{ margin: 0 }}>
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </div>
  );
}

export default ArticlePreview;
