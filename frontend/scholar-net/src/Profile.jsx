import React from "react";

function Profile(props){

    return(
        <div className="profile">
            <h3>{props.name}</h3>
            <p>{props.role}</p>
            <p>{props.bio}</p>
            <button>View Page</button>
        </div>
    )
}

export default Profile
