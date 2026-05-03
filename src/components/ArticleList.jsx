import React from "react";
import { isEmpty } from "lodash-es";
import { useArticlesQuery } from "../hooks";
import ArticlePreview from "./ArticlePreview";

function ArticleList({ filters }) {
  const { isArticlesLoading, articles, ArticlesError } = useArticlesQuery(filters);

  if (isArticlesLoading)
    return <p className="article-preview">Loading articles...</p>;

  if (ArticlesError)
    return <p className="article-preview">Error loading articles. Please try again.</p>;

  // API returns { articles: [...] } — unwrap the array
  const articleList = articles?.articles ?? [];

  // Sort newest first
  const sortedArticles = [...articleList].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  if (isEmpty(sortedArticles))
    return (
      <p className="article-preview">
        No articles are here... yet.
      </p>
    );

  return (
    <>
      {sortedArticles.map((article) => (
        <ArticlePreview
          key={article.slug}
          article={article}
        />
      ))}
    </>
  );
}

export default ArticleList;
