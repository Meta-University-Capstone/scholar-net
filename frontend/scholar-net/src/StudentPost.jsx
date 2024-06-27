import React from "react";

function StudentPost(){
    return(
        <div className="post">
            <h3>Title</h3>
            <p>Content</p>
            <div className="delete-and-edit">
                <button className="delete-btn">Delete</button>
                <button className="edit-btn">Edit</button>
            </div>
        </div>
    )
}

export default StudentPost
