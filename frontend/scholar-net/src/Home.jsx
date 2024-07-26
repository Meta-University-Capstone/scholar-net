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
    const [profileID, setProfileID] = useState(null);
    const [posts, setPosts] = useState([]);

    async function getPosts() {
        try {
          const response = await fetch(`http://localhost:3000/posts`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
          );
          if (!response.ok) {
            throw new Error('Failed to fetch posts');
          }
          const data = await response.json();
          setPosts(data);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
    }

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
            if (user) {
              setUserID(user.uid);
              const response = await fetch(`http://localhost:3000/profile/${user.uid}`);
              if (response.ok) {
                const profiles = await response.json();
                if (profiles.length > 0) {
                  setHasProfile(true);
                  setProfileID(profiles[0].id);
                }
              }
            }
          } catch (error) {
            console.error('Error checking user profile:', error);
          }
        };
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                checkUserProfile();
            } else {
                setHasProfile(false);
            }
        } );
        return () => unsubscribe();
    }, []);


    useEffect(() => {
        getPosts();
    }, []);


    return(
        <>
        <div className="header">
            <img src='/public/applogo.png' alt="App Logo" className="logo" />
            <h1>Scholar-Net</h1>
        </div>
        <AuthDetails/>
        <div className="nav-btns">
            <Link to={`/search`}>
                <button  className="search-btn">Search</button>
            </Link>
            {hasProfile &&(
            <Link to={`/profile/${userID}`}>
                <button  className="profile-btn">Your Profile</button>
            </Link>
        )}
        </div>

        {!hasProfile && (
        <div className='create-profile'>
          <p>Create a Profile to get started!</p>
          <button onClick={toggleProfileForm}>Create a Profile</button>
          {showProfileForm && <CreateAProfile userID={userID} />}
        </div>
        )}

        <FeedList userID={userID} profileID={profileID} refreshPosts={()=>getPosts()}  posts={posts} setPosts={posts} getPosts={getPosts}/>

        <div className='connections-sidebar-home'>
            <button onClick={toggleSidebar}>View Connections</button>
            <ConnectionsSidebar isOpen={isOpen} toggle={toggleSidebar} userID={userID}/>
        </div>
        {hasProfile &&(
            <div className="user-posts">
                <button onClick={togglePostModal}>Create a Post</button>
                {showPostModal && <CreateAPost userID={userID} profileID={profileID} onClose={togglePostModal} refreshPosts={()=>getPosts()}/>}
            </div>
         )}
        <footer className='footer'>
            <p>©️ Helping The Future of Education</p>
        </footer>
        </>
    )
}



export default Home
