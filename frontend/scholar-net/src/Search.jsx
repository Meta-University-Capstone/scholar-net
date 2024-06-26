import React from "react"
import { Link } from "react-router-dom";

function Search(){


    return(
        <>
        <h1>Scholar-Net</h1>
        <Link to={`/`}>
            <button  className="home-btn">Home</button>
        </Link>
        <div className="search-bar">
            <input type="text" placeholder="Search Users. . . . " />
            <button>Search</button>
        </div>
        </>
    )
}

export default Search
