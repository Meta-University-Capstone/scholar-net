import ProfileMatchList from "./ProfileMatchList"
import './Home.css'
import ConnectionsSidebar from "./ConnectionsSidebar";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import CreateAProfile from "./CreateAProfile";

function Home (){
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileForm, setShowProfileForm] = useState(false);


    const toggleSidebar = () => {
        setIsOpen(!isOpen);
      };

    const toggleProfileForm = () => {
        setShowProfileForm(!showProfileForm);
    };

    return(
        <>
        <h1>Scholar-Net</h1>
        <div className="nav-btns">
            <Link to={`/search`}>
                <button  className="search-btn">Search</button>
            </Link>
            <Link to={`/profile`}>
                <button  className="profile-btn">Your Profile</button>
            </Link>
        </div>
        <p>Your top matches for scholarships!</p>
        <ProfileMatchList/>
        <button onClick={toggleProfileForm}>Create a Profile</button>
            {showProfileForm && <CreateAProfile />}
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
