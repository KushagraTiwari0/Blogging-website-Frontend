import React from "react";
import { isEmpty } from "lodash-es";
import ArticlePreview from "./ArticlePreview";
import SkeletonCard from "./SkeletonCard";

function ArticleList({ isArticlesLoading, articles, ArticlesError }) {
  if (isArticlesLoading)
    return (
      <>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </>
    );

  if (ArticlesError)
    return <p className="article-preview">Error loading articles. Please try again.</p>;

  // API now returns { articles: [...], articlesCount: X }
  const articleList = articles?.articles ?? [];

  if (isEmpty(articleList))
    return (
      <p className="article-preview">
        No articles are here... yet.
      </p>
    );

  return (
    <>
      {articleList.map((article) => (
        <ArticlePreview
          key={article.slug}
          article={article}
        />
      ))}
    </>
  );
}

export default ArticleList;
