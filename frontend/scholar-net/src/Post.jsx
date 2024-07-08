import React from "react";
import { useState } from "react";


function Post(props){
    const [likeCount, setLikeCount] = useState(props.likeCount);
    const [unLike, setUnLike] = useState(props.likedByCurrentUser ? "Unlike" : "Like");


    const handleLikeClick = async () => {
        const increment = unLike === "Like" ? 1 : -1;
        try {
            const response = await fetch(`http://localhost:3000/posts/${props.id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ increment })
            });
            if (!response.ok) {
                throw new Error('Failed to update like count');
            }
            const updatedPost = await response.json();
            setLikeCount(updatedPost.likeCount);
            setUnLike(unLike === "Like" ? "Unlike" : "Like");
        } catch (error) {
            console.error('Error updating like count:', error);
        }
    };

      const handlePostEditClick = () => {
        if (props.onEdit) {
          props.onEdit(props.id);
        }
      };

      const handlePostDeleteClick = () => {
        if (props.onDelete) {
          props.onDelete(props.id);
        }
      };

      const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return(
        <div className="post">
             <p>Name: {props.postUser}</p>
            <h3>{props.title}</h3>
            <p>{props.location}</p>
            <p>{props.field_interest}</p>
            <p>{props.content}</p>
            <p>Created: {formatDate(props.created_at)}</p>
            {props.updated_at && props.updated_at !== props.created_at && (
                <p>Updated: {formatDate(props.updated_at)}</p>
            )}
            <div className='like-button'>
                <button onClick={()=>handleLikeClick()}>{unLike}</button><span id="like-count">{likeCount}❤️</span>
            </div>
            <div className="delete-and-edit">
                {props.userID === props.usersuid && (
                    <>
                        <button onClick={()=>handlePostEditClick()}>Edit</button>
                        <button onClick={()=>handlePostDeleteClick()}>Delete</button>
                    </>
                )}
            </div>
        </div>
    )
}

export default Post
