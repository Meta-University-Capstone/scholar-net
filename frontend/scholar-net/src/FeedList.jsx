import Post from './Post'
import './FeedList.css'
import { useState, useEffect } from 'react'

function FeedList(props){

    useEffect(()=>{
        props.getPosts()
    },[])


    function renderPosts(post){
        return(
            <Post
                key={post.id}
                id={post.id}
                userID={props.userID}
                profileID={props.profileID}
                title={post.title}
                postUser={post.postUser}
                content={post.content}
                location={post.location}
                field_interest={post.field_interest}
                likeCount={post.likeCount}
                created_at={post.created_at}
                updated_at={post.updated_at}/>
        )
    }


    return(
        <>
            <div className="feed">
                {props.setPosts.map(renderPosts)}
            </div>
        </>
    )
}

export default FeedList
