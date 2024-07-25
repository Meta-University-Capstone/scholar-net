import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Profile from "./Profile";
import Post from "./Post";
import { auth } from "./firebase";


function OtherUserProfile() {
  const [profile, setProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userID, setUserID] = useState(null);
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
    const fetchConnectionStatus = async (param) => {
        try {
          const response = await fetch(`http://localhost:3000/${param}/other_user/${profileID}/is_connected`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            const isConnected = await response.json();
            if (isConnected===null){
              setIsConnected(false);
            } else{
              setIsConnected(true);
            }
          }
        } catch (error) {
          console.error("Error fetching connection status:", error);
        }
      };
      const checkUserProfile = async () => {
        try {
          const user = auth.currentUser;
          if (user) {
            setUserID(user.uid);
            fetchProfile();
            fetchUserPosts();
            fetchConnectionStatus(user.uid);
          }
        } catch (error) {
          console.error('Error checking user profile:', error);
        }
      };
      const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
              checkUserProfile();
          }
      });
      return () => unsubscribe();
    }, [profileID]);

    const handleAddRemoveConnection = async () => {
        const currentUserID = auth.currentUser.uid

        if (!currentUserID) {
          console.error("Current user ID is not available.");
          return;
        }

        try {
          let response;
          if (isConnected) {
            response = await fetch(`http://localhost:3000/other_user/${profileID}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ currentUserID }),
            });
          } else {
            response = await fetch(`http://localhost:3000/other_user/${profileID}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ currentUserID }),
            });
          }
          if (response.ok) {
            setIsConnected(!isConnected);
          } else {
            console.error("Failed to update connection status");
          }
        } catch (error) {
          console.error("Error updating connection:", error);
        }
      };


  return (
    <>
      <Link to={`/`}>
        <button className="home-btn">Home</button>
      </Link>
      <div className="profile-info">
        <h3>{profile.name}'s Profile</h3>
        <div className="add-remove-connection">
        <button onClick={handleAddRemoveConnection}>
          {isConnected ?  "Remove from Connections" : "Add to Connections"}
        </button>
      </div>
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
