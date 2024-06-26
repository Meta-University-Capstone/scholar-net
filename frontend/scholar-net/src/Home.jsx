import ProfileMatchList from "./ProfileMatchList"
import './Home.css'
import ConnectionsSidebar from "./ConnectionsSidebar";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Home (){
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
      };

    return(
        <>
        <h1>Scholar-Net</h1>
        <Link to={`/search`}>
            <button  className="search-btn">Search</button>
        </Link>

        <p>Find your top matches for scholarships!</p>
        <ProfileMatchList/>
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
