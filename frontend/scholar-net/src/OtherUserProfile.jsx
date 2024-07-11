import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Profile from "./Profile";
import Post from "./Post";

function OtherUserProfile() {
  const [profile, setProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);

  const { profileID } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3000/other_user/${profileID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const profileData = await response.json();
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/profile/${profileID}/posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const postsData = await response.json();
          setUserPosts(postsData);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchProfile();
    fetchUserPosts();
  }, [profileID]);

  return (
    <>
      <Link to={`/`}>
        <button className="home-btn">Home</button>
      </Link>
      <div className="profile-info">
        <h3>{profile.name}'s Profile</h3>
        <Profile
        name={profile.name}
        role={profile.role}
        bio={profile.bio}
        />
      </div>
      <div className="users-posts">
        <h3>{profile.name}'s Posts</h3>
        {userPosts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            userID={post.userID}
            usersuid={profileID}
            profileID={post.profileID}
            title={post.title}
            postUser={post.postUser}
            content={post.content}
            location={post.location}
            field_interest={post.field_interest}
            likeCount={post.likeCount}
            created_at={post.created_at}
            updated_at={post.updated_at}
          />
        ))}
      </div>
    </>
  );
}

export default OtherUserProfile;
