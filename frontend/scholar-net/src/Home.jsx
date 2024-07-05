import './Home.css'
import ConnectionsSidebar from "./ConnectionsSidebar";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreateAProfile from "./CreateAProfile";
import { auth } from "./firebase";
import AuthDetails from "./AuthDetails";
import CreateAPost from "./CreateAPost";
import FeedList from "./FeedList";

function Home (){
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [hasProfile, setHasProfile] = useState(false);
    const [userID, setUserID] = useState(null);
    const [showPostModal, setShowPostModal] = useState(false);



    const toggleSidebar = () => {
        setIsOpen(!isOpen);
      };

    const toggleProfileForm = () => {
        setShowProfileForm(!showProfileForm)
    };

    const togglePostModal = () => {
        setShowPostModal(!showPostModal);
      };

    useEffect(() => {
        const checkUserProfile = async () => {
          try {
            const user = auth.currentUser;
            console.log(user)
            if (user) {
              setUserID(user.uid);
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
        <p>Feed</p>
        <FeedList/>

        {!hasProfile && (
        <div className='create-profile'>
          <p>Create a Profile to get started!</p>
          <button onClick={toggleProfileForm}>Create a Profile</button>
          {showProfileForm && <CreateAProfile userID={userID}/>}
        </div>
        )}
        <div className='connections-sidebar-home'>
            <button onClick={toggleSidebar}>View Connections</button>
            <ConnectionsSidebar isOpen={isOpen} toggle={toggleSidebar}/>
        </div>
        <div className="user-posts">
            <button onClick={togglePostModal}>Create a Post</button>
            {showPostModal && <CreateAPost userID={userID} onClose={togglePostModal} />}
        </div>
        <footer className='footer'>
            <p>©️ Helping The Future of Education</p>
        </footer>
        </>
        )
}



export default Home
