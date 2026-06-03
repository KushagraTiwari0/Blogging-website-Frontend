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
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled — do nothing
      }
      return;
    }
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

// ── Callout Icons ──────────────────────────────────────────────
const calloutIcons = {
  NOTE: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  TIP: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.73a3 3 0 0 0-.613 1.013 3 3 0 0 1-5.837 0 3 3 0 0 0-.613-1.013l-.548-.73z" />
    </svg>
  ),
  IMPORTANT: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  WARNING: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  CAUTION: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
};

// ── Callout Box Parser ─────────────────────────────────────────
const mdComponents = {
  blockquote: ({ node, children, ...props }) => {
    const childrenArray = React.Children.toArray(children);
    
    // Filter out empty or whitespace-only text nodes (such as "\n")
    const realChildren = childrenArray.filter((child) => {
      if (typeof child === "string") {
        return child.trim() !== "";
      }
      return true;
    });

    const firstChild = realChildren[0];

    if (!firstChild) return <blockquote {...props}>{children}</blockquote>;

    // Case A: First child is directly a text string (not wrapped in <p>)
    if (typeof firstChild === "string") {
      const match = firstChild.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
      if (match) {
        const type = match[1].toUpperCase();
        let cleanedFirstNode = firstChild.substring(match[0].length).replace(/^\s+/, "");

        const restOfChildren = realChildren.slice(1);
        const cleanedChildren = [];
        if (cleanedFirstNode !== "") {
          cleanedChildren.push(cleanedFirstNode);
        }

        const hasBrAtStart = restOfChildren[0] && (
          restOfChildren[0].type === "br" || 
          restOfChildren[0].props?.node?.tagName === "br"
        );

        if (cleanedFirstNode === "" && hasBrAtStart) {
          cleanedChildren.push(...restOfChildren.slice(1));
        } else {
          cleanedChildren.push(...restOfChildren);
        }

        return (
          <div className={`callout-box callout-${type.toLowerCase()}`}>
            <div className="callout-badge-tl">
              <span className="callout-icon">{calloutIcons[type]}</span>
            </div>
            <div className="callout-content">
              <div className="callout-title">{type}</div>
              <p>{cleanedChildren}</p>
            </div>
            <div className="callout-badge-br">
              <span className="callout-quote">”</span>
            </div>
          </div>
        );
      }
    }

    // Case B: First child is a React element (like a paragraph <p>) containing children
    if (firstChild.props && firstChild.props.children) {
      const pChildren = React.Children.toArray(firstChild.props.children);
      const firstTextNode = pChildren[0];

      if (typeof firstTextNode === "string") {
        const match = firstTextNode.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
        if (match) {
          const type = match[1].toUpperCase();
          let cleanedFirstNode = firstTextNode.substring(match[0].length).replace(/^\s+/, "");

          const restOfChildren = pChildren.slice(1);
          const cleanedPChildren = [];
          if (cleanedFirstNode !== "") {
            cleanedPChildren.push(cleanedFirstNode);
          }

          const hasBrAtStart = restOfChildren[0] && (
            restOfChildren[0].type === "br" || 
            restOfChildren[0].props?.node?.tagName === "br"
          );

          if (cleanedFirstNode === "" && hasBrAtStart) {
            cleanedPChildren.push(...restOfChildren.slice(1));
          } else {
            cleanedPChildren.push(...restOfChildren);
          }

          const cleanedParagraph = React.cloneElement(firstChild, {
            ...firstChild.props,
            children: cleanedPChildren,
          });

          return (
            <div className={`callout-box callout-${type.toLowerCase()}`}>
              <div className="callout-badge-tl">
                <span className="callout-icon">{calloutIcons[type]}</span>
              </div>
              <div className="callout-content">
                <div className="callout-title">{type}</div>
                {cleanedParagraph}
                {realChildren.slice(1)}
              </div>
              <div className="callout-badge-br">
                <span className="callout-quote">”</span>
              </div>
            </div>
          );
        }
      }
    }

    return <blockquote {...props}>{children}</blockquote>;
  },
};

// ── Article ────────────────────────────────────────────────────
function Article() {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
                <ReactMarkdown remarkPlugins={mdPlugins} components={mdComponents}>
                  {article.description}
                </ReactMarkdown>
              </div>
            )}

            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={mdPlugins} components={mdComponents}>
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