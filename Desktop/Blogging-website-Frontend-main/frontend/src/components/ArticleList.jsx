import React from "react";
import { isEmpty } from "lodash-es";
import { useArticlesQuery } from "../hooks";
import ArticlePreview from "./ArticlePreview";

function ArticleList() {
  const { articles } = useArticlesQuery();

  console.log("ArticleList", { articles });

  // Check if articles exist and sort them by date (newest first)
  const sortedArticles = articles
    ? articles.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt),
      )
    : [];

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
