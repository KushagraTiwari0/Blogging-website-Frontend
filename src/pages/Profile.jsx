import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArticleList, SEO } from "../components";
import { useAuth, useArticlesQuery } from "../hooks";
import { API_BASE_URL } from "../constants";

const DEFAULT_AVATAR = (username) =>
  `https://api.dicebear.com/9.x/thumbs/svg?seed=${username}`;

// ── User list modal (followers / following) ────────────────────
function UserListModal({ title, users, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>{title}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {users.length === 0 ? (
          <p className="modal-empty">Nobody here yet.</p>
        ) : (
          <ul className="modal-user-list">
            {users.map((u) => (
              <li key={u.username} className="modal-user-item">
                <Link to={`/profile/@${u.username}`} onClick={onClose}>
                  <img
                    src={u.image || DEFAULT_AVATAR(u.username)}
                    alt={u.username}
                  />
                  <div>
                    <span className="modal-username">@{u.username}</span>
                    {u.bio && <span className="modal-bio">{u.bio}</span>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ── Profile Page ───────────────────────────────────────────────
function Profile() {
  const { slug } = useParams();
  const username  = slug?.startsWith("@") ? slug.substring(1) : slug;

  const { authUser } = useAuth();
  const navigate     = useNavigate();

  const isOwn = authUser?.username?.toLowerCase() === username?.toLowerCase();
  const token  = authUser?.token || localStorage.getItem("token");
  const headers = token ? { Authorization: `Token ${token}` } : {};

  const [profile,    setProfile]    = useState(null);
  const [following,  setFollowing]  = useState(false);
  const [fLoading,   setFLoading]   = useState(false);
  const [tab,        setTab]        = useState("authored");
  const [modal,      setModal]      = useState(null);
  const [modalUsers, setModalUsers] = useState([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState(null);
  
  const articleFilters =
    tab === "favorited"
      ? { favorited: username }
      : { author: username };

  const { isArticlesLoading, articles, ArticlesError } = useArticlesQuery(articleFilters);

  console.log("[PROFILE] Articles state:", { tab, articleFilters, articles, isArticlesLoading });

  // ── Fetch profile ────────────────────────────────────────
  useEffect(() => {
    if (!username) return;
    setIsLoading(true);
    setError(null);
    axios
      .get(`${API_BASE_URL}/api/profiles/${username}`, { headers })
      .then(({ data }) => {
        setProfile(data.profile);
        setFollowing(data.profile.following);
      })
      .catch(() => setError("Could not load profile"))
      .finally(() => setIsLoading(false));
  }, [username, authUser]);

  // ── Follow / Unfollow ────────────────────────────────────
  const handleFollow = async () => {
    if (!authUser) { navigate("/login"); return; }
    if (fLoading) return;
    setFLoading(true);
    try {
      if (following) {
        const { data } = await axios.delete(
          `${API_BASE_URL}/api/profiles/${username}/follow`,
          { headers }
        );
        setProfile(data.profile);
        setFollowing(false);
      } else {
        const { data } = await axios.post(
          `${API_BASE_URL}/api/profiles/${username}/follow`,
          {},
          { headers }
        );
        setProfile(data.profile);
        setFollowing(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFLoading(false);
    }
  };

  // ── Open followers / following modal ─────────────────────
  const openModal = async (type) => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/profiles/${username}/${type}`,
        { headers }
      );
      setModalUsers(data[type] || []);
      setModal(type);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div className="page container loading-indicator">Loading profile...</div>;
  if (error || !profile) return <div className="page container loading-indicator">{error || "Profile not found"}</div>;

  const avatar =
    profile.image &&
    profile.image !== "https://api.realworld.io/images/smiley-cyrus.jpeg"
      ? profile.image
      : DEFAULT_AVATAR(profile.username);

  return (
    <div className="profile-page">
      <SEO
        title={`@${profile.username}`}
        description={profile.bio || `Check out @${profile.username}'s profile and articles on Blogging.`}
        url={window.location.href}
        image={avatar}
        type="profile"
      />

      {/* ── Banner ── */}
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1" style={{ textAlign: "center" }}>

              <img src={avatar} alt={profile.username} />
              <h4>@{profile.username}</h4>
              {profile.bio && <p>{profile.bio}</p>}

              {/* Follower / following counts */}
              <div className="profile-stats">
                <button
                  className="profile-stat-btn"
                  onClick={() => openModal("followers")}
                >
                  <strong>{profile.followersCount ?? 0}</strong>
                  <span>Followers</span>
                </button>
                <div className="profile-stat-divider" />
                <button
                  className="profile-stat-btn"
                  onClick={() => openModal("following")}
                >
                  <strong>{profile.followingCount ?? 0}</strong>
                  <span>Following</span>
                </button>
              </div>

              {/* Action button */}
              {isOwn ? (
                <button
                  className="btn btn-sm btn-outline-primary profile-action-btn"
                  onClick={() => navigate("/settings")}
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  className={`btn btn-sm profile-action-btn ${
                    following ? "btn-follow-active" : "btn-outline-primary"
                  }`}
                  onClick={handleFollow}
                  disabled={fLoading}
                >
                  {fLoading ? "..." : following ? "✓ Following" : `+ Follow @${profile.username}`}
                </button>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ── Articles ── */}
      <div className="container page">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">

            <div className="feed-toggle">
              <ul className="nav-pills">
                <li className="nav-item">
                  <button
                    className={`nav-link ${tab === "authored" ? "active" : ""}`}
                    onClick={() => setTab("authored")}
                  >
                    My Articles
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${tab === "favorited" ? "active" : ""}`}
                    onClick={() => setTab("favorited")}
                  >
                    Liked Articles
                  </button>
                </li>
              </ul>
            </div>

            <ArticleList 
              isArticlesLoading={isArticlesLoading}
              articles={articles}
              ArticlesError={ArticlesError}
            />

          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {modal && (
        <UserListModal
          title={modal === "followers" ? "Followers" : "Following"}
          users={modalUsers}
          onClose={() => { setModal(null); setModalUsers([]); }}
        />
      )}
    </div>
  );
}

export default Profile;