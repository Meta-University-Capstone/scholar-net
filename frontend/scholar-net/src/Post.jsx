import React from "react";

function Post(props){
    return(
        <div className="post">
            <h3>{props.title}</h3>
            <p>{props.content}</p>
            <p>{props.location}</p>
            <p>{props.field_interest}</p>
            <p>{props.likeCount}</p>
            <p>{props.created_at}</p>
            <p>{props.updated_at}</p>
            <div className="delete-and-edit">
                <button className="delete-btn">Delete</button>
                <button className="edit-btn">Edit</button>
            </div>
        </div>
    )
}

export default Post
