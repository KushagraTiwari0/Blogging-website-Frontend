import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { ArticleComments, ArticleMeta } from "../components";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../constants";

function Article() {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  const getArticleBySlug = async (slug) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/articles/${slug}`);
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

  const mdPlugins = [remarkGfm, remarkBreaks];

  return (
    <div className="article-page">

      {/* ── Banner ── */}
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

      {/* ── Body ── */}
      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">

            {/* Description — parsed as markdown so bold/italic/paragraphs work */}
            {article?.description && (
              <div className="article-description markdown-body">
                <ReactMarkdown remarkPlugins={mdPlugins}>
                  {article.description}
                </ReactMarkdown>
              </div>
            )}

            {/* Body */}
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={mdPlugins}>
                {article?.body || ""}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            {article?.tagList?.length > 0 && (
              <ul className="tag-list" style={{ marginTop: "24px", padding: 0 }}>
                {article.tagList.map((tag) => (
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
          <div className="col-xs-12 col-md-8 offset-md-2">
            <ArticleComments />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Article;