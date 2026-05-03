import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks'

function ArticleMeta({author,createdAt}) {
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
 
    </div>
  )
}

export default ArticleMeta
