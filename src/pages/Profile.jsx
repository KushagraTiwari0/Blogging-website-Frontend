import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArticleList } from "../components";
import { useAuth } from "../hooks";
import { API_BASE_URL } from "../constants";

function Profile() {
  const { slug } = useParams();
  const username = slug?.startsWith("@") ? slug.substring(1) : slug;
  
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const isCurrentUser = authUser?.username === username;

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/profiles/${username}`);
        setProfile(data.profile);
      } catch (err) {
        setError("Could not load profile");
        console.error("Profile fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (isLoading) return <div className="page container">Loading profile...</div>;
  if (error || !profile) return <div className="page container">{error || "Profile not found"}</div>;

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img 
                src={profile.image && profile.image !== "https://api.realworld.io/images/smiley-cyrus.jpeg" ? profile.image : `https://api.dicebear.com/9.x/thumbs/svg?seed=${profile.username}`} 
                className="user-img" 
                alt={profile.username} 
              />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
              
              {isCurrentUser ? (
                <button
                  className="btn btn-sm btn-outline-secondary action-btn"
                  onClick={() => navigate("/settings")}
                >
                  <i className="ion-gear-a"></i> Edit Profile Settings
                </button>
              ) : (
                <button className="btn btn-sm btn-outline-secondary action-btn">
                  <i className="ion-plus-round"></i>
                  &nbsp; Follow {profile.username}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <a className="nav-link active" href="#">
                    My Articles
                  </a>
                </li>
              </ul>
            </div>
            
            <ArticleList filters={{ author: profile.username }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
