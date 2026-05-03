import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../hooks'
import { API_BASE_URL } from '../constants'

function ArticleMeta({ author, createdAt, article, onFavoriteChange }) {
  const { authUser } = useAuth()
  const navigate = useNavigate()

  const [favorited, setFavorited]       = useState(article?.favorited ?? false)
  const [favoritesCount, setFavoritesCount] = useState(article?.favoritesCount ?? 0)
  const [isLoading, setIsLoading]       = useState(false)

  const canUpdate = authUser?.username === author?.username

  const handleFavorite = async () => {
    if (!authUser) {
      navigate('/login')
      return
    }
    if (isLoading) return
    setIsLoading(true)

    const token = authUser?.token || localStorage.getItem('token')
    const slug  = article?.slug

    try {
      if (favorited) {
        // Unlike
        const { data } = await axios.delete(
          `${API_BASE_URL}/api/articles/${slug}/favorite`,
          { headers: { Authorization: `Token ${token}` } }
        )
        setFavorited(false)
        setFavoritesCount(data.article.favoritesCount)
        onFavoriteChange?.(data.article)
      } else {
        // Like
        const { data } = await axios.post(
          `${API_BASE_URL}/api/articles/${slug}/favorite`,
          {},
          { headers: { Authorization: `Token ${token}` } }
        )
        setFavorited(true)
        setFavoritesCount(data.article.favoritesCount)
        onFavoriteChange?.(data.article)
      }
    } catch (err) {
      console.error('Favorite error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const avatarSrc =
    author?.image &&
    author.image !== 'https://api.realworld.io/images/smiley-cyrus.jpeg'
      ? author.image
      : `https://api.dicebear.com/9.x/thumbs/svg?seed=${author?.username}`

  return (
    <div className="article-meta">
      {/* Avatar */}
      <Link to={`/profile/${author?.username}`}>
        <img src={avatarSrc} alt="author" />
      </Link>

      {/* Author + date */}
      <div className="info">
        <Link to={`/profile/${author?.username}`} className="author">
          {author?.username}
        </Link>
        <span className="date">{new Date(createdAt).toDateString()}</span>
      </div>

      {/* Actions */}
      <div className="article-meta-actions">
        {/* ── Like button ── */}
        <button
          className={`like-btn${favorited ? ' like-btn--active' : ''}`}
          onClick={handleFavorite}
          disabled={isLoading}
          title={favorited ? 'Unlike this article' : 'Like this article'}
        >
          <svg
            width="13" height="13"
            viewBox="0 0 24 24"
            fill={favorited ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, transition: 'fill 0.2s ease' }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{favoritesCount}</span>
        </button>

        {/* ── Edit button (author only) ── */}
        {canUpdate && (
          <Link
            to={`/editor/${article?.slug}`}
            className="btn btn-sm btn-outline-primary"
          >
            <svg
              width="12" height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </Link>
        )}
      </div>
    </div>
  )
}

export default ArticleMeta