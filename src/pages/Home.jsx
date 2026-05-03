import classNames from 'classnames'
import React from 'react'
import { ArticleList, PopularTags } from '../components'
import { useArticlesQuery, useAuth } from '../hooks'

const initialFilters = { tag: '', offset: null, feed: false }

function Home() {
  const { isAuth } = useAuth()
  const [filters, setFilters] = React.useState({ ...initialFilters, feed: isAuth })
  const { isArticlesLoading, articles, ArticlesError } = useArticlesQuery(filters);


  React.useEffect(() => {
    setFilters({ ...initialFilters, feed: isAuth })
  }, [isAuth])

  function onTagClick(tag) {
    setFilters({ ...initialFilters, tag })
  }

  function onGlobalFeedClick() {
    setFilters(initialFilters)
  }

  function onFeedClick() {
    setFilters({ ...initialFilters, feed: true })
  }

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">Blogging</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>
      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {isAuth && (
                  <li className="nav-item">
                    <button
                      onClick={onFeedClick}
                      type="button"
                      className={classNames('nav-link', {
                        active: filters.feed && !filters.tag,
                      })}
                    >
                      Your Feed
                    </button>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    onClick={onGlobalFeedClick}
                    type="button"
                    className={classNames('nav-link', {
                      active: !filters.feed && !filters.tag,
                    })}
                  >
                    Global Feed
                  </button>
                </li>
                {filters.tag && (
                  <li className="nav-item">
                    <button
                      type="button"
                      className="nav-link active"
                    >
                      <i className="ion-pound"></i> {filters.tag}
                    </button>
                  </li>
                )}
              </ul>
            </div>
            <ArticleList filters={filters} />
          </div>
          
          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <PopularTags onTagClick={onTagClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home


