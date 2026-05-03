import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks'

function ArticleMeta({author,createdAt, article}) {
  const { authUser } = useAuth()

  const canUpdate = authUser?.username === author?.username


  return (
    <div className="article-meta">
      <Link to={`/profile/${author?.username}`}>
        <img src={author?.image && author.image !== "https://api.realworld.io/images/smiley-cyrus.jpeg" ? author.image : `https://api.dicebear.com/9.x/thumbs/svg?seed=${author?.username}`} alt="author" />
      </Link>
      <div className="info">
        <Link to={`/profile/${author?.username}`} className="author">
          {author?.username}
        </Link>
        <span className="date">{new Date(createdAt).toDateString()}</span>
      </div>

      {canUpdate && (
        <span style={{ marginLeft: 'auto' }}>
          <Link
            to={`/editor/${article?.slug}`}
            className="btn btn-sm btn-outline-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="ion-edit"></i> Edit Article
          </Link>
        </span>
      )}
    </div>
  )
}

export default ArticleMeta
