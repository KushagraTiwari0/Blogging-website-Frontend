import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { ArticleComments, ArticleMeta, SEO } from "../components";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../constants";

// ── Share Button ───────────────────────────────────────────────
function ShareButton({ title, url }) {
  const [state, setState] = useState("idle"); // idle | copied | error

  const handleShare = async () => {
    // Native share sheet on mobile (Android/iOS)
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled — do nothing
      }
      return;
    }
    // Desktop fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2500);
    }
  };

  const label =
    state === "copied" ? "✓ Link copied!" :
    state === "error"  ? "✗ Copy failed"  :
    "Share";

  return (
    <button
      className={`share-btn${state !== "idle" ? " share-btn--done" : ""}`}
      onClick={handleShare}
      title="Share this article"
    >
      <svg
        width="13" height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <circle cx="18" cy="5"  r="3" />
        <circle cx="6"  cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59"  y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49" />
      </svg>
      {label}
    </button>
  );
}

// ── Article ────────────────────────────────────────────────────
function Article() {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]     = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    axios
      .get(`${API_BASE_URL}/api/articles/${slug}`)
      .then(({ data }) => setArticle(data.article))
      .catch((err) => { console.error(err); setError("Article not found or failed to load."); })
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) return <div className="page container loading-indicator">Loading article...</div>;
  if (error || !article) return <div className="page container loading-indicator">{error || "Article not found"}</div>;

  const mdPlugins  = [remarkGfm, remarkBreaks];
  const articleUrl = window.location.href;

  // Build JSON-LD structured data for search engines
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: {
      "@type": "Person",
      name: article.author?.username || "Unknown",
    },
    publisher: {
      "@type": "Organization",
      name: "Blogging",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    keywords: article.tagList?.join(", ") || "",
  });

  return (
    <article className="article-page">
      <SEO
        title={article.title}
        description={article.description || `Read ${article.title} on Blogging`}
        url={articleUrl}
        type="article"
        author={article.author?.username}
        publishedTime={article.createdAt}
        modifiedTime={article.updatedAt}
        tags={article.tagList || []}
        jsonLd={jsonLd}
      />

      {/* ── Banner ────────────────────────────────────────── */}
      <div className="article-banner">
        <div className="container">
          <h1>{article.title}</h1>
          <div className="article-banner-meta">
            <ArticleMeta
              author={article.author}
              createdAt={article.createdAt}
              article={article}
            />
            <ShareButton title={article.title} url={articleUrl} />
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">

            {article.description && (
              <div className="article-description markdown-body">
                <ReactMarkdown remarkPlugins={mdPlugins}>
                  {article.description}
                </ReactMarkdown>
              </div>
            )}

            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={mdPlugins}>
                {article.body || ""}
              </ReactMarkdown>
            </div>

            {article.tagList?.length > 0 && (
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

        {/* ── Footer meta + share ───────────────────────── */}
        <div className="article-actions article-footer-actions">
          <ArticleMeta
            author={article.author}
            createdAt={article.createdAt}
            article={article}
          />
          <ShareButton title={article.title} url={articleUrl} />
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <ArticleComments />
          </div>
        </div>
      </div>
    </article>
  );
}

export default Article;