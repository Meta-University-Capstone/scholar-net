import ProfileMatchList from "./ProfileMatchList"
import './Home.css'
import ConnectionsSidebar from "./ConnectionsSidebar";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import CreateAProfile from "./CreateAProfile";
import { auth } from "./firebase";
import AuthDetails from "./AuthDetails";

function Home (){
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [hasProfile, setHasProfile] = useState(false);
    const [userID, setUserID] = useState(null);


    const toggleSidebar = () => {
        setIsOpen(!isOpen);
      };

    const toggleProfileForm = () => {
        setShowProfileForm(!showProfileForm);
    };

    useEffect(() => {
        const checkUserProfile = async () => {
          try {
            const user = auth.currentUser;
            if (user) {
                setUserID(user.uid);
              // Fetch user profile information to determine if a profile exists
              const response = await fetch(`http://localhost:3000/profile/${user.uid}`);
              if (response.ok) {
                const profiles = await response.json();
                if (profiles.length > 0) {
                  setHasProfile(true);
                }
              }
            }
          } catch (error) {
            console.error('Error checking user profile:', error);
          }
        };

        checkUserProfile();
      }, []);


    return(
        <>
        <h1>Scholar-Net</h1>
        <AuthDetails/>
        <div className="nav-btns">
            <Link to={`/search`}>
                <button  className="search-btn">Search</button>
            </Link>
            <Link to={`/profile/${userID}`}>
                <button  className="profile-btn">Your Profile</button>
            </Link>
        </div>
        <p>Your top matches for scholarships!</p>
        <ProfileMatchList/>

        {!hasProfile && (
        <>
        <p>Don't have any matches yet?</p>
          <button onClick={toggleProfileForm}>Create a Profile</button>
          {showProfileForm && <CreateAProfile uid={auth.currentUser.uid} />}
        </>
      )}
        <div className='connections-sidebar-home'>
            <button onClick={toggleSidebar}>View Connections</button>
       </div>
        <ConnectionsSidebar isOpen={isOpen} toggle={toggleSidebar}/>
        <footer className='footer'>
            <p>©️ Helping The Future of Education</p>
        </footer>
        </>
        )
}



export default Home
