import React from "react";
import { useState } from "react";

function Post(props){
    const [likeCount, setLikeCount] = useState(0);
    const [unLike, setUnLike] = useState("Like");


    const handleLikeClick = () => {
        if(unLike === "Like"){
          setLikeCount(likeCount + 1);
          setUnLike("Unlike")
        } else{
          setLikeCount(likeCount - 1);
          setUnLike("Like")
        }
      };

    return(
        <div className="post">
             <p>Name: {props.postUser}</p>
            <h3>{props.title}</h3>
            <p>{props.location}</p>
            <p>{props.field_interest}</p>
            <p>{props.content}</p>
            <p>Created: {new Date(props.created_at).toLocaleString()}</p>
            <p>{props.updated_at ? new Date(props.updated_at).toLocaleString() : " "}</p>
            <div className='like-button'>
                <button onClick={()=>handleLikeClick()}>{unLike}</button><span id="like-count">{likeCount}💗</span>
            </div>
            <div className="delete-and-edit">
                <button className="delete-btn">Delete</button>
                <button className="edit-btn">Edit</button>
            </div>
        </div>
    )
}

export default Post
