import React, {
  useEffect,
  useState,
} from "react";
import {
  ArticleComments,
  ArticleMeta,
} from "../components";
import { useArticleQuery } from "../hooks";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../constants";

function Article() {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  console.log("article", article);

  const getArticleBySlug = async (slug) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/articles/${slug}`,
      );
      setArticle(data.article);
    } catch (err) {
      console.error(err);
      setError("Article not found or failed to load.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!slug) return;
    getArticleBySlug(slug);
  }, [slug]);

  if (isLoading) return <div className="page container loading-indicator">Loading article...</div>;
  if (error || !article) return <div className="page container loading-indicator">{error || "Article not found"}</div>;

  return (
    <div className="article-page">
      <div className="article-banner">
        <div className="container">
          <h1>{article?.title}</h1>
          <ArticleMeta
            author={article?.author}
            createdAt={article?.createdAt}
            article={article}
          />
        </div>
      </div>
      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>{article?.description}</p>
            <p>{article?.body}</p>
            
            {article?.tagList && article.tagList.length > 0 && (
              <ul className="tag-list" style={{ marginTop: '24px', display: 'flex', gap: '6px', listStyle: 'none', padding: 0 }}>
                {article.tagList.map(tag => (
                  <li key={tag} className="tag-default tag-pill tag-outline" style={{ margin: 0 }}>
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <hr />
        <div className="article-actions">
          <ArticleMeta
            author={article?.author}
            createdAt={article?.createdAt}
            article={article}
          />
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-8 offeset-md-2">
            <ArticleComments />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Article;
