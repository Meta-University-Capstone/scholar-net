import React from "react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import './ProfilePage.css'
import Profile from "./Profile";
import FeedList from "./FeedList";


function ProfilePage(){
const[profile, setProfile] = useState({})
const [editing, setEditing] = useState(false);
const [userPosts, setUserPosts] = useState([]);


const {userID} = useParams();


  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    const response = await fetch(`http://localhost:3000/profile/${userID}/${profile.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: profile.userID,
        name: profile.name,
        bio: profile.bio,
        role: profile.role,
      }), id: profile.id,
    });
    if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setEditing(false);
  };}


    useEffect(() => {
        const fetchProfile = async () => {
        try {
            const response = await fetch(`http://localhost:3000/profile/${userID}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            });

            if (response.ok) {
            const profiles = await response.json();
            if (profiles.length > 0) {
                setProfile(profiles[0]);
            }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
        };
        const fetchUserPosts = async () => {
            try {
              const postsResponse = await fetch(`http://localhost:3000/posts/user/${userID}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });

              if (postsResponse.ok) {
                const posts = await postsResponse.json();
                setUserPosts(posts);
              }
            } catch (error) {
              console.error('Error fetching user posts:', error);
            }
          };

          fetchProfile();
          fetchUserPosts();
        }, [userID]);

        if (!profile) {
          return <p>Loading...</p>;
        }


    return(
        <>
        <h1>Scholar-Net</h1>
        <Link to={`/`}>
            <button  className="home-btn">Home</button>
        </Link>
        <div className="profile-info">
            <h3>Your Profile</h3>
            <Profile
            name={profile.name}
            role={profile.role}
            bio={profile.bio}
            />
            <button onClick={handleEditClick}>Edit Profile</button>

            {editing && (
                <div className="modal-overlay open">
                    <div className="modal-content">
                        <form>
                            <label>
                                Name:<input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                            </label>
                            <label>
                                Bio:<textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
                            </label>
                            <label>
                                Role:<select value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })}>
                                <option value="">Select a role</option>
                                <option value="High School Student">High School Student</option>
                                <option value="Scholarship Benefactor">Scholarship Benefactor</option>
                                </select>
                            </label>
                            <button onClick={handleSaveClick}>Save Changes</button>
                        </form>
                    </div>
                </div>
            )}

        </div>
        <div className="users-posts">
            <h3>Your Posts</h3>
            {/* <FeedList
            posts={userPosts} // Pass userPosts as a prop to FeedList
            refreshPosts={() => fetchUserPosts()} // Function to refresh posts after editing or deleting
          /> */}


        </div>
        </>

    )
}

export default ProfilePage
