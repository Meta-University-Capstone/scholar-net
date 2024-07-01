import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import './ProfilePage.css'

function ProfilePage({uid}){
const[profile, setProfile] = useState({})
const [editing, setEditing] = useState(false);


  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    const updatedProfile = await fetch(`http://localhost:3000/profile/${uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });
    setProfile(updatedProfile);
    setEditing(false);
  };


    useEffect(() => {
        const fetchProfile = async () => {
        try {
            const response = await fetch(`http://localhost:3000/profile/${uid}`,{
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
        fetchProfile();
    }, [uid]);

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
            <p>{profile.name}</p>
            <p>{profile.role}</p>
            <p>{profile.bio}</p>
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

        <div className="user-posts">
            <button>Create an Update Post</button>
        </div>


        </>

    )
}

export default ProfilePage
