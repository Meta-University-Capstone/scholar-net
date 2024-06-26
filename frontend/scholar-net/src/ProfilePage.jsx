import React from "react";
import { Link } from "react-router-dom";

function ProfilePage(){
    return(
        <>
        <h1>Scholar-Net</h1>
        <Link to={`/`}>
            <button  className="home-btn">Home</button>
        </Link>
        <div className="profile-info">
            <h3>Your Profile</h3>
            <p>user email</p>
            <p>user bio</p>
            <button>Edit Profile</button>
        </div>

        <div className="user-posts">
        </div>


        </>

    )
}

export default ProfilePage
