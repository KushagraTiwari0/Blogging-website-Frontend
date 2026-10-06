import classNames from "classnames";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArticleList, PopularTags, SEO } from "../components";
import { useArticlesQuery, useAuth } from "../hooks";
import axios from "axios";
import { API_BASE_URL } from "../constants";

const initialFilters = { tag: "", offset: 0, limit: 10, feed: false, sort: "likes" };

function Home() {
  const { isAuth, authUser } = useAuth();
  const navigate = useNavigate();

  const [filters, setFilters] = React.useState({ ...initialFilters, feed: isAuth });
  const [feedEmpty, setFeedEmpty] = React.useState(false);
  const [feedChecked, setFeedChecked] = React.useState(false);

  const { isArticlesLoading, articles, ArticlesError } = useArticlesQuery(filters);

  // ── When auth changes reset filters ───────────────────────
  React.useEffect(() => {
    setFilters({ ...initialFilters, feed: isAuth });
    setFeedEmpty(false);
    setFeedChecked(false);
  }, [isAuth]);

  // ── Check if Your Feed is empty → fall back to global ─────
  React.useEffect(() => {
    if (!isAuth || !filters.feed || feedChecked) return;

    const token = authUser?.token || localStorage.getItem("token");
    axios
      .get(`${API_BASE_URL}/api/articles/feed`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then(({ data }) => {
        const empty = !data.articles || data.articles.length === 0;
        setFeedEmpty(empty);
        setFeedChecked(true);
        if (empty) setFilters(initialFilters);
      })
      .catch(() => {
        setFeedChecked(true);
      });
  }, [isAuth, filters.feed, feedChecked]);

  function onTagClick(tag) {
    setFilters({ ...initialFilters, tag });
  }

  function onGlobalFeedClick() {
    setFilters(initialFilters);
  }

  function onFeedClick() {
    if (feedEmpty) return;
    setFilters({ ...initialFilters, feed: true });
  }

  function onPageClick(page) {
    setFilters({ ...filters, offset: page * filters.limit });
    window.scrollTo(0, 0);
  }

  const isYourFeed = filters.feed && !filters.tag;
  const isGlobalFeed = !filters.feed && !filters.tag;

  const articlesCount = articles?.articlesCount || 0;
  const totalPages = Math.ceil(articlesCount / filters.limit);
  const currentPage = Math.floor(filters.offset / filters.limit);

  return (
    <div className="home-page">
      <SEO
        title="Home"
        description="Discover articles, stories, and insights from writers on any topic. A place to share your knowledge."
        url={window.location.href}
        type="website"
      />
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">Blogging</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle" style={{ display: "flex", alignItems: "center" }}>
              <ul className="nav-pills" style={{ flex: 1, borderBottom: "1px solid var(--rule)" }}>
                {isAuth && (
                  <li className="nav-item">
                    <button
                      type="button"
                      onClick={onFeedClick}
                      className={classNames("nav-link", { active: isYourFeed })}
                      title={feedEmpty ? "Follow some authors to see their posts here" : ""}
                    >
                      Your Feed
                      {feedEmpty && feedChecked && (
                        <span className="feed-tab-hint"> (follow someone!)</span>
                      )}
                    </button>
                  </li>
                )}

                <li className="nav-item">
                  <button
                    type="button"
                    onClick={onGlobalFeedClick}
                    className={classNames("nav-link", { active: isGlobalFeed })}
                  >
                    Global Feed
                  </button>
                </li>

                {filters.tag && (
                  <li className="nav-item">
                    <button
                      type="button"
                      className="nav-link active"
                      onClick={() => setFilters({ ...initialFilters, tag: filters.tag })}
                    >
                      # {filters.tag}
                    </button>
                  </li>
                )}
              </ul>
              {(!filters.feed || filters.tag) && (
                <div style={{ paddingBottom: "10px", borderBottom: "1px solid var(--rule)", display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Sort by:</span>
                  <select 
                    value={filters.sort || "likes"} 
                    onChange={(e) => setFilters({ ...filters, sort: e.target.value, offset: 0 })}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "0",
                      border: "1px solid var(--rule-dark)",
                      background: "transparent",
                      color: "var(--body-text)",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      outline: "none",
                      fontFamily: "var(--font-ui)"
                    }}
                  >
                    <option value="likes">Most Liked</option>
                    <option value="date">Latest</option>
                  </select>
                </div>
              )}
            </div>

            {isAuth && isYourFeed && feedChecked && feedEmpty ? (
              <div className="feed-empty-state">
                <p className="feed-empty-title">Your feed is empty</p>
                <p className="feed-empty-sub">
                  Follow some authors and their posts will appear here.
                  In the meantime, check the{" "}
                  <button className="feed-empty-link" onClick={onGlobalFeedClick}>
                    Global Feed
                  </button>
                  .
                </p>
              </div>
            ) : (
              <>
                <ArticleList 
                   isArticlesLoading={isArticlesLoading}
                   articles={articles}
                   ArticlesError={ArticlesError}
                />
                
                {totalPages > 1 && (
                  <nav>
                    <ul className="pagination">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <li
                          key={i}
                          className={classNames("page-item", { active: i === currentPage })}
                        >
                          <button
                            className="page-link"
                            onClick={() => onPageClick(i)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <PopularTags onTagClick={onTagClick} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Write Button */}
      <button 
        onClick={() => navigate("/editor")}
        className="btn btn-lg btn-outline-primary"
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
        title="Write an article"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        Write
      </button>
    </div>
  );
}

export default Home;