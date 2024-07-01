import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function ProfilePage({uid}){
const[profile, setProfile] = useState({})

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
            <button>Edit Profile</button>
        </div>

        <div className="user-posts">
        </div>


        </>

    )
}

export default ProfilePage
