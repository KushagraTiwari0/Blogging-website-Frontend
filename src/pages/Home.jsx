import classNames from "classnames";
import React from "react";
import { ArticleList, PopularTags } from "../components";
import { useArticlesQuery, useAuth } from "../hooks";
import axios from "axios";
import { API_BASE_URL } from "../constants";

const initialFilters = { tag: "", offset: null, feed: false };

function Home() {
  const { isAuth, authUser } = useAuth();

  const [filters,        setFilters]        = React.useState({ ...initialFilters, feed: isAuth });
  const [feedEmpty,      setFeedEmpty]      = React.useState(false); // true when user follows nobody
  const [feedChecked,    setFeedChecked]    = React.useState(false); // avoid flicker

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
        // If nobody followed yet, silently switch to global
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
    if (feedEmpty) return; // nothing to show
    setFilters({ ...initialFilters, feed: true });
  }

  const isYourFeed    = filters.feed && !filters.tag;
  const isGlobalFeed  = !filters.feed && !filters.tag;

  return (
    <div className="home-page">

      {/* ── Banner ── */}
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">Blogging</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">

          {/* ── Main feed ── */}
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav-pills">

                {/* Your Feed tab — only shown when logged in */}
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

                {/* Global Feed tab */}
                <li className="nav-item">
                  <button
                    type="button"
                    onClick={onGlobalFeedClick}
                    className={classNames("nav-link", { active: isGlobalFeed })}
                  >
                    Global Feed
                  </button>
                </li>

                {/* Active tag tab */}
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
            </div>

            {/* Empty state for Your Feed */}
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
              <ArticleList filters={filters} />
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <PopularTags onTagClick={onTagClick} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;